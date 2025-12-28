import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default async function SettingsPage() {
  const mockProfile = {
    restaurant_name: "The Gourmet Kitchen",
    first_name: "Alex",
    last_name: "Chef",
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your restaurant profile and account settings.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Profile</CardTitle>
            <CardDescription>Update your public restaurant information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="restaurantName">Restaurant Name</Label>
              <Input id="restaurantName" defaultValue={mockProfile.restaurant_name} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">Chef First Name</Label>
                <Input id="firstName" defaultValue={mockProfile.first_name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Chef Last Name</Label>
                <Input id="lastName" defaultValue={mockProfile.last_name} />
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Update your login credentials.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="chef@example.com" disabled />
              <p className="text-xs text-muted-foreground">Account settings are currently static.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
