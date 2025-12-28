"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Clock, CheckCircle2, Utensils, AlertCircle } from "lucide-react"

export type OrderStatus = "received" | "pending" | "preparing" | "ready" | "completed" | "cancelled"

export interface Order {
  id: string
  status: OrderStatus
  customer_name: string | null
  table_number: string | null
  total_amount: number
  created_at: string
  order_items: any[]
}

export function OrderList({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const { toast } = useToast()
  const supabase = createClient()

  const fetchOrder = async (orderId: string) => {
    const { data: newOrder } = await supabase
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
      .eq("id", orderId)
      .single()
    return newOrder as Order | null
  }

  useEffect(() => {
    // Realtime subscription for instant updates
    const channel = supabase
      .channel("orders-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        async (payload) => {
          const newOrder = await fetchOrder(payload.new.id)
          if (newOrder) {
            setOrders((prev) => {
              const exists = prev.some((o) => o.id === newOrder.id)
              if (exists) return prev
              return [newOrder, ...prev]
            })
            toast({
              title: "New Order Received!",
              description: `Order #${newOrder.id.slice(0, 5)} from ${newOrder.customer_name || "Guest"}`,
            })
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        async (payload) => {
          // For updates, we can either use the payload or refetch
          // Refetching is safer to get all joined data
          const updatedOrder = await fetchOrder(payload.new.id)
          if (updatedOrder) {
            setOrders((prev) =>
              prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
            )
          } else {
            // Fallback if refetch fails - just use payload
            setOrders((prev) =>
              prev.map((o) =>
                o.id === payload.new.id ? { ...o, ...payload.new } : o
              )
            )
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "orders" },
        (payload) => {
          setOrders((prev) => prev.filter((o) => o.id !== payload.old.id))
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to orders realtime')
        }
      })

    // Low priority polling as backup (every 10 seconds instead of 5 to save resources)
    const pollInterval = setInterval(async () => {
      const { data: latestOrders } = await supabase
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
        .limit(50)

      if (latestOrders) {
        setOrders(latestOrders as Order[])
      }
    }, 15000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(pollInterval)
    }
  }, [supabase, toast])

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // Optimistic update
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))

      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)

      if (error) throw error

      toast({
        title: "Status Updated",
        description: `Order ${orderId.slice(0, 8)} is now ${newStatus}.`,
      })
    } catch (error: any) {
      // Revert optimism if needed, or just show error
      console.error(error)
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "An error occurred while updating the status.",
      })
    }
  }

  const getStatusBadge = (status: OrderStatus) => {
    const normalizedStatus = status?.toLowerCase() as OrderStatus

    switch (normalizedStatus) {
      case "received":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Received
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Pending
          </Badge>
        )
      case "preparing":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Preparing
          </Badge>
        )
      case "ready":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Ready
          </Badge>
        )
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">Status: {status}</Badge>
    }
  }

  if (orders.length === 0) {
    return (
      <Card className="p-12 border-dashed flex flex-col items-center justify-center text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Clock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No active orders</h3>
        <p className="text-sm text-muted-foreground">When customers place orders, they will appear here.</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <Card key={order.id} className={order.status?.toLowerCase() === "received" ? "border-primary/50 shadow-sm" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span className="font-bold">#{order.id.slice(0, 5)}</span>
              {order.table_number && <span className="text-muted-foreground">Table {order.table_number}</span>}
            </CardTitle>
            {getStatusBadge(order.status)}
          </CardHeader>

          {/* Received status: Show minimal info with Accept button */}
          {order.status?.toLowerCase() === "received" ? (
            <>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Customer: {order.customer_name || "Guest"}</span>
                  <span className="font-bold">₹{Number(order.total_amount).toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="bg-primary/5 pt-4">
                <Button size="sm" className="w-full" onClick={() => updateStatus(order.id, "preparing")}>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Accept Order
                </Button>
              </CardFooter>
            </>
          ) : (
            /* All other statuses: Show full details with action buttons */
            <>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order Items</p>
                  <ul className="space-y-1">
                    {order.order_items.map((item) => (
                      <li key={item.id} className="text-sm flex justify-between items-center">
                        <span>
                          {item.quantity}x {item.menu_items?.name || "Item deleted"}
                        </span>
                        {item.notes && (
                          <span className="text-[10px] bg-accent/20 px-1.5 py-0.5 rounded text-accent-foreground ml-2">
                            {item.notes}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Customer: {order.customer_name || "Guest"}</span>
                  <span className="font-bold">₹{Number(order.total_amount).toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 pt-4 flex gap-2">
                {order.status?.toLowerCase() === "pending" && (
                  <Button size="sm" className="w-full" onClick={() => updateStatus(order.id, "preparing")}>
                    <Utensils className="mr-2 h-4 w-4" /> Start Cooking
                  </Button>
                )}
                {order.status?.toLowerCase() === "preparing" && (
                  <Button
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => updateStatus(order.id, "ready")}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Ready
                  </Button>
                )}
                {order.status?.toLowerCase() === "ready" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => updateStatus(order.id, "completed")}
                  >
                    Complete
                  </Button>
                )}
                {order.status?.toLowerCase() === "completed" && (
                  <p className="text-xs text-center w-full text-muted-foreground">Completed</p>
                )}
                {(order.status?.toLowerCase() === "pending" || order.status?.toLowerCase() === "preparing") && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="px-2 text-destructive"
                    onClick={() => updateStatus(order.id, "cancelled")}
                  >
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </>
          )}
        </Card>
      ))}
    </div>
  )
}
