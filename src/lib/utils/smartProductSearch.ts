/**
 * Recherche intelligente de produits
 * Recherche par mots-clés partiels avec logique ET
 * 
 * Exemples:
 * - "Molicare 8G XL" → trouve "Molicare Premium Elastic 8G XL"
 * - "elastic 6G M" → trouve tous les Elastic 6G Medium
 * - "seni classic" → trouve tous les Seni Classic
 * - "165474" → trouve par code exact
 */
export function smartProductSearch(products: any[], query: string): any[] {
  if (!query || !query.trim()) return products;
  
  const searchTerms = query
    .toLowerCase()
    .trim()
    .split(/\s+/) // Découper par espaces
    .filter(term => term.length > 0); // Garder tous les termes
  
  if (searchTerms.length === 0) return products;
  
  return products.filter(product => {
    const searchableText = [
      product.designation.toLowerCase(),
      product.code.toLowerCase(),
    ].join(" ");
    
    // TOUS les mots-clés doivent être trouvés (logique ET)
    return searchTerms.every(term => searchableText.includes(term));
  });
}