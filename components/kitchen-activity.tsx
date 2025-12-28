"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface HourlyData {
    hour: string
    orders: number
}

export function KitchenActivity({ initialData }: { initialData: HourlyData[] }) {
    const [chartData, setChartData] = useState<HourlyData[]>(initialData)
    const supabase = createClient()

    useEffect(() => {
        const channel = supabase
            .channel("kitchen-activity-realtime")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => {
                const newOrderDate = new Date(payload.new.created_at)
                const today = new Date()

                // Only update if the order is from today
                if (newOrderDate.toDateString() === today.toDateString()) {
                    const hour = newOrderDate.getHours()
                    const hourLabel = `${hour.toString().padStart(2, '0')}:00`

                    setChartData((prev) =>
                        prev.map((item) =>
                            item.hour === hourLabel
                                ? { ...item, orders: item.orders + 1 }
                                : item
                        )
                    )
                }
            })
            .on("postgres_changes", { event: "DELETE", schema: "public", table: "orders" }, (payload) => {
                // If an order is deleted, decrement the count
                if (payload.old.created_at) {
                    const deletedDate = new Date(payload.old.created_at)
                    const today = new Date()
                    if (deletedDate.toDateString() === today.toDateString()) {
                        const hour = deletedDate.getHours()
                        const hourLabel = `${hour.toString().padStart(2, '0')}:00`
                        setChartData((prev) =>
                            prev.map((item) =>
                                item.hour === hourLabel
                                    ? { ...item, orders: Math.max(0, item.orders - 1) }
                                    : item
                            )
                        )
                    }
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    return (
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="hour"
                        tick={{ fontSize: 12 }}
                        interval={2}
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px'
                        }}
                        labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Bar
                        dataKey="orders"
                        fill="#f97316"
                        radius={[4, 4, 0, 0]}
                        name="Orders"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
