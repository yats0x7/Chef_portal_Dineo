import type React from "react"
import Link from "next/link"
import { ChefHat, LayoutDashboard, UtensilsCrossed, ClipboardList, Settings } from "lucide-react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Chef Portal</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-accent-foreground"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/menus"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-accent-foreground"
          >
            <UtensilsCrossed className="h-4 w-4" />
            Menus
          </Link>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-accent-foreground"
          >
            <ClipboardList className="h-4 w-4" />
            Orders
          </Link>
        </nav>

        <div className="p-4 border-t space-y-1">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-accent-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b flex items-center justify-between px-8 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <h2 className="text-lg font-semibold capitalize">Workspace</h2>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              C
            </div>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
