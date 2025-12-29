"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, ChevronLeft, Loader2, Trash2, Edit2, ImageIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import Image from "next/image"

interface MenuItem {
    id: string
    name: string
    description: string
    price: number
    category: string
    image_url: string
    is_available: boolean
}

interface Menu {
    id: string
    name: string
}

export default function MenuItemsPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const supabase = createClient()
    const menuId = params.id as string

    const [menu, setMenu] = useState<Menu | null>(null)
    const [items, setItems] = useState<MenuItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch menu details
                const { data: menuData, error: menuError } = await supabase
                    .from("menus")
                    .select("id, name")
                    .eq("id", menuId)
                    .single()

                if (menuError) throw menuError
                setMenu(menuData)

                // Fetch menu items
                const { data: itemsData, error: itemsError } = await supabase
                    .from("menu_items")
                    .select("*")
                    .eq("menu_id", menuId)
                    .order("category", { ascending: true })
                    .order("name", { ascending: true })

                if (itemsError) throw itemsError
                setItems(itemsData || [])
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Error loading items",
                    description: error.message
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (menuId) fetchData()
    }, [menuId, supabase, toast])

    const handleDeleteItem = async (itemId: string, itemName: string) => {
        if (!confirm(`Are you sure you want to delete "${itemName}"?`)) return

        try {
            const { error } = await supabase
                .from("menu_items")
                .delete()
                .eq("id", itemId)

            if (error) throw error

            setItems(prev => prev.filter(i => i.id !== itemId))
            toast({ title: "Item deleted", description: `"${itemName}" has been removed.` })
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Failed to delete item",
                description: error.message
            })
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href="/dashboard/menus">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="space-y-0.5">
                        <h1 className="text-3xl font-bold tracking-tight">{menu?.name}</h1>
                        <p className="text-muted-foreground">Manage dishes and drinks for this menu.</p>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/dashboard/menus/${menuId}/items/new`}>
                        <Plus className="mr-2 h-4 w-4" /> Add Item
                    </Link>
                </Button>
            </div>

            {items.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 border-dashed">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">No items in this menu</h3>
                    <p className="text-sm text-muted-foreground mb-6">Start by adding your first dish or drink.</p>
                    <Button asChild variant="outline">
                        <Link href={`/dashboard/menus/${menuId}/items/new`}>Add First Item</Link>
                    </Button>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {items.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                            <div className="flex flex-col sm:flex-row">
                                <div className="relative w-full sm:w-32 h-32 sm:h-auto bg-muted shrink-0">
                                    {item.image_url ? (
                                        <Image
                                            src={item.image_url}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            <ImageIcon className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-lg">{item.name}</h3>
                                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-primary/10 text-primary">
                                                    {item.category}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg">₹{item.price}</p>
                                            <p className={`text-[10px] font-bold ${item.is_available ? "text-green-600" : "text-destructive"}`}>
                                                {item.is_available ? "AVAILABLE" : "OUT OF STOCK"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/dashboard/menus/${menuId}/items/${item.id}`}>
                                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDeleteItem(item.id, item.name)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
