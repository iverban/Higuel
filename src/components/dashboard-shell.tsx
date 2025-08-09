"use client";

import Link from "next/link";
import { Home, FileText, DollarSign, Folder, Settings } from "lucide-react";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 text-white p-4">
        <nav className="space-y-2">
          <Link href="/dashboard" className="flex items-center gap-2 hover:text-blue-400">
            <Home size={18} /> Dashboard
          </Link>
          <Link href="/properties" className="flex items-center gap-2 hover:text-blue-400">
            <FileText size={18} /> Properties
          </Link>
          <Link href="/finances" className="flex items-center gap-2 hover:text-blue-400">
            <DollarSign size={18} /> Finances
          </Link>
          <Link href="/files" className="flex items-center gap-2 hover:text-blue-400">
            <Folder size={18} /> Files
          </Link>
          <Link href="/settings" className="flex items-center gap-2 hover:text-blue-400">
            <Settings size={18} /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-neutral-800 p-6">{children}</main>
    </div>
  );
}
