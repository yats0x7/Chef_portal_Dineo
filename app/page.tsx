import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChefHat, UtensilsCrossed, ClipboardList, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react"

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="px-6 lg:px-12 h-20 flex items-center justify-between border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2">
                    <ChefHat className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold tracking-tight">Chef Portal</span>
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
                    <Link href="#solutions" className="text-sm font-medium hover:text-primary transition-colors">Solutions</Link>
                    <Button asChild variant="default" size="sm">
                        <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 lg:py-32 overflow-hidden bg-background">
                    <div className="container px-6 mx-auto relative z-10">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 border border-primary/20">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                FOR MODERN KITCHENS
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-foreground">
                                Simplify Your <span className="text-primary">Culinary</span> Operations.
                            </h1>
                            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">
                                The all-in-one management suite for professional chefs. Track orders in real-time,
                                manage digital menus, and optimize your kitchen's performance with ease.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="px-8 text-lg">
                                    <Link href="/dashboard">
                                        Get Started <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="px-8 text-lg">
                                    <Link href="#features">Learn More</Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-card">
                    <div className="container px-6 mx-auto">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold mb-4">Built for Efficiency</h2>
                            <p className="text-muted-foreground">Every tool you need to run a high-performance kitchen, focused on speed and reliability.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Real-time Orders",
                                    description: "Monitor incoming orders with instant updates. Never miss a ticket during peak hours.",
                                    icon: ClipboardList,
                                    color: "bg-blue-500/10 text-blue-600"
                                },
                                {
                                    title: "Menu Management",
                                    description: "Create and update digital menus in seconds. Sync availability across all customer touchpoints.",
                                    icon: UtensilsCrossed,
                                    color: "bg-primary/10 text-primary"
                                },
                                {
                                    title: "Kitchen Analytics",
                                    description: "Track revenue and hourly volume to optimize staffing and inventory planning.",
                                    icon: TrendingUp,
                                    color: "bg-green-500/10 text-green-600"
                                }
                            ].map((feature, i) => (
                                <div key={i} className="p-8 rounded-2xl border bg-background hover:shadow-lg transition-all hover:-translate-y-1 group">
                                    <div className={`h-12 w-12 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-primary text-primary-foreground">
                    <div className="container px-6 mx-auto text-center">
                        <h2 className="text-4xl font-extrabold mb-8">Ready to transform your kitchen?</h2>
                        <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                            Join hundreds of chefs who have streamlined their operations with Chef Portal.
                            Start managing your restaurant more effectively today.
                        </p>
                        <Button asChild size="lg" variant="secondary" className="px-10 text-lg font-bold">
                            <Link href="/dashboard">Launch Dashboard</Link>
                        </Button>

                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-80">
                            {['Real-time Sync', 'Easy Setup', 'Premium Support', 'Mobile Ready'].map((item) => (
                                <div key={item} className="flex items-center justify-center gap-2">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <span className="font-medium text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 px-6 lg:px-12 border-t bg-card">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <ChefHat className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">Chef Portal</span>
                    </div>
                    <p className="text-sm text-muted-foreground">© 2024 Chef Portal. All rights reserved.</p>
                    <div className="flex gap-6 text-sm font-medium text-muted-foreground">
                        <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms</a>
                        <a href="#" className="hover:text-primary transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
