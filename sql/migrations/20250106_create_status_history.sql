-- Migration: Création table historique des statuts de devis
-- À exécuter dans Supabase SQL Editor

-- 1. Créer la table d'historique des statuts
CREATE TABLE IF NOT EXISTS devis_status_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    devis_id UUID NOT NULL REFERENCES devis(id) ON DELETE CASCADE,
    previous_status TEXT NOT NULL,
    new_status TEXT NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    changed_by TEXT,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Index pour performances
CREATE INDEX IF NOT EXISTS idx_devis_status_history_devis_id 
ON devis_status_history(devis_id);

CREATE INDEX IF NOT EXISTS idx_devis_status_history_changed_at 
ON devis_status_history(changed_at DESC);

-- 3. Trigger pour mise à jour automatique du timestamp
CREATE OR REPLACE FUNCTION update_devis_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Appliquer le trigger à la table devis existante
DROP TRIGGER IF EXISTS trigger_update_devis_timestamp ON devis;
CREATE TRIGGER trigger_update_devis_timestamp
    BEFORE UPDATE ON devis
    FOR EACH ROW
    EXECUTE FUNCTION update_devis_status_timestamp();

-- 5. Fonction pour créer automatiquement l'historique lors des changements
CREATE OR REPLACE FUNCTION log_devis_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Seulement si le statut a changé
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO devis_status_history (
            devis_id,
            previous_status,
            new_status,
            changed_by,
            note
        ) VALUES (
            NEW.id,
            COALESCE(OLD.status, 'brouillon'),
            NEW.status,
            'System', -- Peut être remplacé par l'utilisateur actuel
            'Changement automatique via interface'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger automatique pour les changements de statut
DROP TRIGGER IF EXISTS trigger_log_status_change ON devis;
CREATE TRIGGER trigger_log_status_change
    AFTER UPDATE ON devis
    FOR EACH ROW
    EXECUTE FUNCTION log_devis_status_change();

-- 7. Politique RLS (Row Level Security) pour sécurité
ALTER TABLE devis_status_history ENABLE ROW LEVEL SECURITY;

-- Politique permettant la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Users can view status history" ON devis_status_history
    FOR SELECT USING (true);

-- Politique permettant l'insertion aux utilisateurs authentifiés
CREATE POLICY "Users can insert status history" ON devis_status_history
    FOR INSERT WITH CHECK (true);

-- 8. Données initiales - Créer l'historique pour les devis existants
INSERT INTO devis_status_history (devis_id, previous_status, new_status, changed_at, changed_by, note)
SELECT 
    id as devis_id,
    'brouillon' as previous_status,
    COALESCE(status, 'brouillon') as new_status,
    created_at as changed_at,
    'Migration initiale' as changed_by,
    'Historique créé lors de la migration' as note
FROM devis 
WHERE id NOT IN (
    SELECT DISTINCT devis_id FROM devis_status_history
);

-- 9. Vue pour simplifier les requêtes d'historique
CREATE OR REPLACE VIEW devis_with_status_info AS
SELECT 
    d.*,
    dsh.changed_at as last_status_change,
    dsh.changed_by as last_changed_by,
    (
        SELECT COUNT(*) 
        FROM devis_status_history 
        WHERE devis_id = d.id
    ) as status_changes_count
FROM devis d
LEFT JOIN LATERAL (
    SELECT changed_at, changed_by
    FROM devis_status_history
    WHERE devis_id = d.id
    ORDER BY changed_at DESC
    LIMIT 1
) dsh ON true;

-- 10. Fonction pour obtenir l'historique complet d'un devis
CREATE OR REPLACE FUNCTION get_devis_status_history(devis_uuid UUID)
RETURNS TABLE (
    id UUID,
    previous_status TEXT,
    new_status TEXT,
    changed_at TIMESTAMP WITH TIME ZONE,
    changed_by TEXT,
    note TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dsh.id,
        dsh.previous_status,
        dsh.new_status,
        dsh.changed_at,
        dsh.changed_by,
        dsh.note
    FROM devis_status_history dsh
    WHERE dsh.devis_id = devis_uuid
    ORDER BY dsh.changed_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Vérification de la migration
SELECT 
    'Migration terminée avec succès' as status,
    COUNT(*) as devis_count,
    (SELECT COUNT(*) FROM devis_status_history) as history_count
FROM devis;