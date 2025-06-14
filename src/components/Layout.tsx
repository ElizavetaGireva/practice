import React from "react";
import { TabNavigation } from "./TabNavigation";

interface LayoutProps {
  children: React.ReactNode;
  userRole?: "admin" | "user";
}

export function Layout({ children, userRole = "user" }: LayoutProps) {
  return (
    <div className="min-h-screen bg-app-background flex flex-col">
      {/* Main Content */}
      <main className="flex-1 overflow-hidden pb-20">{children}</main>

      {/* Fixed Footer with Tab Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-app-border-light z-50">
        <TabNavigation userRole={userRole} />
      </footer>
    </div>
  );
}
