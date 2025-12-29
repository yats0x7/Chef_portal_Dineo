import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Plus, UtensilsCrossed, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { MenuActions } from "@/components/menu-actions"

export default async function MenusPage() {
  const supabase = await createClient()

  const { data: menus } = await supabase.from("menus").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Menus</h1>
          <p className="text-muted-foreground">Create and manage your restaurant's digital menus.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/menus/new">
            <Plus className="mr-2 h-4 w-4" /> New Menu
          </Link>
        </Button>
      </div>

      {!menus || menus.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 border-dashed">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">No menus created yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Start by creating your first digital menu.</p>
          <Button asChild variant="outline">
            <Link href="/dashboard/menus/new">Create Your First Menu</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menus.map((menu) => (
            <Card key={menu.id} className="overflow-hidden group hover:border-primary/50 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{menu.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {menu.description || "No description provided."}
                    </CardDescription>
                  </div>
                  <MenuActions menuId={menu.id} menuName={menu.name} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={`px-2 py-0.5 rounded-full ${menu.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}
                  >
                    {menu.is_active ? "Active" : "Draft"}
                  </span>
                  <Button variant="link" size="sm" asChild className="px-0">
                    <Link href={`/dashboard/menus/${menu.id}/items`}>View Items</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
