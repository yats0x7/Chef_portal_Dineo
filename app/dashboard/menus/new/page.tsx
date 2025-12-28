"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function NewMenuPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)) // simulate API call

      toast({ title: "Menu created", description: "Your new menu has been successfully created." })
      router.push("/dashboard/menus")
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create menu",
        description: "An error occurred while creating the menu.",
      })
    } finally {
      setIsLoading(false)
    }
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
          <CardTitle className="text-2xl">Create New Menu</CardTitle>
          <CardDescription>Enter the details for your new digital menu.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Menu Name</Label>
              <Input
                id="name"
                placeholder="e.g. Lunch Specials, Summer Dinner 2024"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe the theme or focus of this menu..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button type="button" variant="outline" asChild disabled={isLoading}>
              <Link href="/dashboard/menus">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Menu"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
