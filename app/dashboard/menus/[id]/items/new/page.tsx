"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, Loader2, Save, Plus } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function NewMenuItemPage() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [isAvailable, setIsAvailable] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()
    const supabase = createClient()
    const menuId = params.id as string

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const { error } = await supabase
                .from("menu_items")
                .insert([{
                    menu_id: menuId,
                    name,
                    description,
                    price: parseFloat(price),
                    category,
                    image_url: imageUrl,
                    is_available: isAvailable
                }])

            if (error) throw error

            toast({ title: "Item added", description: `"${name}" has been added to the menu.` })
            router.push(`/dashboard/menus/${menuId}/items`)
            router.refresh()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Failed to add item",
                description: error.message || "An error occurred.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                <Link href={`/dashboard/menus/${menuId}/items`} className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" /> Back to Items
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Add New Item</CardTitle>
                    <CardDescription>Enter the details for a new dish or drink.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <Label htmlFor="name">Item Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Truffle Pasta"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <Label htmlFor="price">Price (₹)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                placeholder="e.g. Starters, Mains, Dessert, Drinks"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the ingredients or taste..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                            <Input
                                id="imageUrl"
                                placeholder="https://images.unsplash.com/..."
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="isAvailable"
                                checked={isAvailable}
                                onChange={(e) => setIsAvailable(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="isAvailable">Item is available for order</Label>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3">
                        <Button type="button" variant="outline" asChild disabled={isLoading}>
                            <Link href={`/dashboard/menus/${menuId}/items`}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                            Add to Menu
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
