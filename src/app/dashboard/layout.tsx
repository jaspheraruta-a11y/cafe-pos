import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { House, LayoutDashboard, ShoppingBag, User } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/dashboard");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "client") {
    if (profile?.role === "admin") redirect("/admin");
    if (profile?.role === "rider") redirect("/rider");
  }

  return (
    <div className="min-h-screen bg-cream-50 flex">
      <aside className="w-56 border-r border-coffee-200 bg-white hidden md:block">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center gap-2 font-display font-semibold text-coffee-800">
            <House className="h-5 w-5" />
            AJ&apos;s Café
          </Link>
        </div>
        <nav className="p-2 space-y-1">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/orders">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <ShoppingBag className="h-4 w-4" />
              My orders
            </Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <User className="h-4 w-4" />
              Profile
            </Button>
          </Link>
          <Link href="/order">
            <Button variant="outline" className="w-full justify-start gap-2 mt-4">
              Order again
            </Button>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
