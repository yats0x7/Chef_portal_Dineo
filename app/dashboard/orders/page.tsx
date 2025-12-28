import { OrderList, type Order } from "@/components/order-list"
import { createClient } from "@/lib/supabase/server"

export default async function OrdersPage() {
  // Fetch orders with their items
  const supabase = await createClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        quantity,
        notes,
        menu_items (
          name
        )
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    // You might want to handle this error more gracefully in a real app
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Order Tracking</h1>
        <p className="text-muted-foreground">Monitor and update the status of incoming kitchen orders.</p>
      </div>

      <OrderList initialOrders={(orders as Order[]) || []} />
    </div>
  )
}
