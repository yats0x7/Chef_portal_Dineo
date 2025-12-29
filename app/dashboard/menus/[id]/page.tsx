"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function EditMenuPage() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isActive, setIsActive] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()
    const supabase = createClient()
    const menuId = params.id as string

    useEffect(() => {
        async function fetchMenu() {
            try {
                const { data, error } = await supabase
                    .from("menus")
                    .select("*")
                    .eq("id", menuId)
                    .single()

                if (error) throw error

                if (data) {
                    setName(data.name)
                    setDescription(data.description || "")
                    setIsActive(data.is_active)
                }
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Error fetching menu",
                    description: error.message || "Could not load menu details."
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (menuId) fetchMenu()
    }, [menuId, supabase, toast])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const { error } = await supabase
                .from("menus")
                .update({
                    name,
                    description,
                    is_active: isActive
                })
                .eq("id", menuId)

            if (error) throw error

            toast({ title: "Menu updated", description: "Your changes have been saved." })
            router.push("/dashboard/menus")
            router.refresh()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Failed to update menu",
                description: error.message || "An error occurred.",
            })
        } finally {
            setIsSaving(false)
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
        <div className="max-w-2xl mx-auto space-y-6">
            <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                <Link href="/dashboard/menus" className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" /> Back to Menus
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Edit Menu Details</CardTitle>
                    <CardDescription>Update name and description for this menu.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Menu Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="is_active">Make this menu active</Label>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3">
                        <Button type="button" variant="outline" asChild disabled={isSaving}>
                            <Link href="/dashboard/menus">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
