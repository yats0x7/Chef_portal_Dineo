"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export type OrderStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled"

interface Order {
    id: string
    status: OrderStatus
    customer_name: string | null
    total_amount: number
    created_at: string
}

export function RecentOrders({ initialOrders }: { initialOrders: Order[] }) {
    const [orders, setOrders] = useState<Order[]>(initialOrders)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const channel = supabase
            .channel("dashboard-orders")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => {
                // For recent orders, we can just use the payload if it has the fields we need
                // but let's make it more robust by ensuring the fields are there
                setOrders((prev) => {
                    const exists = prev.some(o => o.id === payload.new.id)
                    if (exists) return prev
                    return [payload.new as Order, ...prev].slice(0, 5)
                })
            })
            .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders" }, (payload) => {
                setOrders((prev) => prev.map((o) => (o.id === payload.new.id ? { ...o, ...payload.new } : o)))
            })
            .on("postgres_changes", { event: "DELETE", schema: "public", table: "orders" }, (payload) => {
                setOrders((prev) => prev.filter((o) => o.id !== payload.old.id))
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    const getStatusBadge = (status: OrderStatus) => {
        switch (status?.toLowerCase()) {
            case "pending": return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>
            case "preparing": return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Preparing</Badge>
            case "ready": return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ready</Badge>
            default: return <Badge variant="secondary">{status}</Badge>
        }
    }

    if (orders.length === 0) {
        return <p className="text-sm text-muted-foreground">No recent orders found.</p>
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                            Order #{order.id.slice(0, 5)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {order.customer_name || "Guest"} • ₹{Number(order.total_amount).toFixed(2)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {getStatusBadge(order.status)}
                        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/orders')}>
                            View
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}
