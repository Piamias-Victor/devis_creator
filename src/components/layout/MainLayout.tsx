"use client";

import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { cn } from "@/lib/utils/cn";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Layout principal de l'application
 * Header fixe + Navigation latérale + Zone de contenu
 */
export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Header />
      <Navigation />
      
      {/* Zone de contenu principale */}
       <main className={cn(
        "ml-16 pt-6 pb-8 px-6 transition-all duration-300",
        "min-h-[calc(100vh-80px)] w-[calc(100vw-4rem)]",
        className
      )}>
        <div className="max-w-none w-full">
          {children}
        </div>
      </main>
    </div>
  );
}