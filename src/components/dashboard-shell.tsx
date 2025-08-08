"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, DollarSign, Folder, Settings } from "lucide-react";
import SignOutButton from "./signout-button";

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/properties", label: "Properties", icon: Home },
    { href: "/timeline", label: "Timeline", icon: FileText },
    { href: "/due-diligence", label: "Due Diligence", icon: FileText },
    { href: "/financials", label: "Financials", icon: DollarSign },
    { href: "/documents", label: "Documents", icon: Folder },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      <aside className="w-64 bg-neutral-800 p-4 space-y-6">
        <h1 className="text-xl font-bold">Higuel Dashboard</h1>
        <nav className="space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 p-2 rounded hover:bg-neutral-700 ${
                pathname === href ? "bg-neutral-700" : ""
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <SignOutButton />
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
