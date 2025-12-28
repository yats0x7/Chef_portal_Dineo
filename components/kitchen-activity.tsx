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
        // Refresh data when new orders come in
        const channel = supabase
            .channel("kitchen-activity")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, async () => {
                // Fetch updated hourly data
                const today = new Date().toISOString().split("T")[0]
                const { data: orders } = await supabase
                    .from("orders")
                    .select("created_at")
                    .gte("created_at", today)

                if (orders) {
                    // Group by hour
                    const hourCounts: Record<string, number> = {}

                    orders.forEach((order) => {
                        const hour = new Date(order.created_at).getHours()
                        const hourLabel = `${hour.toString().padStart(2, '0')}:00`
                        hourCounts[hourLabel] = (hourCounts[hourLabel] || 0) + 1
                    })

                    // Convert to array and fill gaps
                    const newData: HourlyData[] = []
                    for (let h = 0; h < 24; h++) {
                        const hourLabel = `${h.toString().padStart(2, '0')}:00`
                        newData.push({
                            hour: hourLabel,
                            orders: hourCounts[hourLabel] || 0,
                        })
                    }

                    setChartData(newData)
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
