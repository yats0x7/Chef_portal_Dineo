"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface MenuActionsProps {
    menuId: string
    menuName: string
}

export function MenuActions({ menuId, menuName }: MenuActionsProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()
    const { toast } = useToast()
    const supabase = createClient()

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete the menu "${menuName}" and all its items?`)) {
            return
        }

        setIsDeleting(true)
        try {
            // Supabase RLS and cascading deletes should handle the items
            const { error } = await supabase
                .from("menus")
                .delete()
                .eq("id", menuId)

            if (error) throw error

            toast({
                title: "Menu deleted",
                description: `"${menuName}" has been successfully removed.`
            })

            router.refresh()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Deletion failed",
                description: error.message || "An error occurred while deleting the menu."
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isDeleting}>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={`/dashboard/menus/${menuId}`}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Details
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleDelete}
                >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Menu
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
