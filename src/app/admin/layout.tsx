import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  House,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  Receipt,
  Tag,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/admin");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-cream-50 flex">
      <aside className="w-56 border-r border-coffee-200 bg-coffee-950 text-cream-100 shrink-0 hidden md:block">
        <div className="p-4 border-b border-coffee-800">
          <Link href="/admin" className="flex items-center gap-2 font-display font-semibold text-cream-50">
            <House className="h-5 w-5 text-coffee-400" />
            AJ&apos;s Café
          </Link>
          <p className="text-xs text-coffee-400 mt-1">Admin</p>
        </div>
        <nav className="p-2 space-y-1">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start gap-2 text-cream-200 hover:text-cream-50 hover:bg-coffee-800">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/pos">
            <Button variant="ghost" className="w-full justify-start gap-2 text-cream-200 hover:text-cream-50 hover:bg-coffee-800">
              <ShoppingCart className="h-4 w-4" />
              POS
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="ghost" className="w-full justify-start gap-2 text-cream-200 hover:text-cream-50 hover:bg-coffee-800">
              <Receipt className="h-4 w-4" />
              Orders
            </Button>
          </Link>
          <Link href="/admin/products">
            <Button variant="ghost" className="w-full justify-start gap-2 text-cream-200 hover:text-cream-50 hover:bg-coffee-800">
              <Package className="h-4 w-4" />
              Products
            </Button>
          </Link>
          <Link href="/admin/riders">
            <Button variant="ghost" className="w-full justify-start gap-2 text-cream-200 hover:text-cream-50 hover:bg-coffee-800">
              <Truck className="h-4 w-4" />
              Riders
            </Button>
          </Link>
          <Link href="/admin/promos">
            <Button variant="ghost" className="w-full justify-start gap-2 text-cream-200 hover:text-cream-50 hover:bg-coffee-800">
              <Tag className="h-4 w-4" />
              Promos
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full justify-start gap-2 mt-4 border-coffee-600 text-cream-200">
              Back to site
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
