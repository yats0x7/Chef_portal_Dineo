import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UtensilsCrossed, ClipboardList, TrendingUp, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { RecentOrders } from "@/components/recent-orders"
import { KitchenActivity } from "@/components/kitchen-activity"

export default async function DashboardPage() {
  const supabase = await createClient()

  const today = new Date().toISOString().split("T")[0]

  // Parallel fetch all dashboard data
  const [
    { count: activeMenusCount },
    { count: pendingOrdersCount },
    { data: todaysOrders },
    { count: completedOrdersCount },
    { data: recentOrders },
    { data: todaysOrdersForChart }
  ] = await Promise.all([
    supabase.from("menus").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("orders").select("*", { count: "exact", head: true }).in("status", ["received", "pending", "preparing"]),
    supabase.from("orders").select("total_amount").gte("created_at", today),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("orders").select("created_at").gte("created_at", today)
  ])

  // revenue (today)
  const todaysRevenue = todaysOrders?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0

  // Group orders by hour
  const hourCounts: Record<string, number> = {}

  todaysOrdersForChart?.forEach((order) => {
    const hour = new Date(order.created_at).getHours()
    const hourLabel = `${hour.toString().padStart(2, '0')}:00`
    hourCounts[hourLabel] = (hourCounts[hourLabel] || 0) + 1
  })

  // Create 24-hour data array
  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const hourLabel = `${i.toString().padStart(2, '0')}:00`
    return {
      hour: hourLabel,
      orders: hourCounts[hourLabel] || 0,
    }
  })

  const stats = [
    { title: "Active Menus", value: activeMenusCount || 0, icon: UtensilsCrossed, color: "text-primary" },
    { title: "Pending Orders", value: pendingOrdersCount || 0, icon: ClipboardList, color: "text-accent" },
    { title: "Today's Revenue", value: `₹${todaysRevenue.toFixed(2)}`, icon: TrendingUp, color: "text-green-600" },
    { title: "Orders Completed", value: completedOrdersCount || 0, icon: Users, color: "text-blue-600" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Chef</h1>
        <p className="text-muted-foreground">Here's what's happening in your kitchen today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Kitchen Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <KitchenActivity initialData={hourlyData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders initialOrders={((recentOrders as any[]) || [])} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
