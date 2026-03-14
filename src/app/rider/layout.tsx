import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { House, LayoutDashboard, Truck, History } from "lucide-react";

export default async function RiderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/rider");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "rider") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-cream-50 flex">
      <aside className="w-56 border-r border-coffee-200 bg-white hidden md:block">
        <div className="p-4 border-b">
          <Link href="/rider" className="flex items-center gap-2 font-display font-semibold text-coffee-800">
            <House className="h-5 w-5" />
            AJ&apos;s Café
          </Link>
          <p className="text-xs text-coffee-500 mt-1">Rider</p>
        </div>
        <nav className="p-2 space-y-1">
          <Link href="/rider">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/rider/deliveries">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Truck className="h-4 w-4" />
              Deliveries
            </Button>
          </Link>
          <Link href="/rider/history">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <History className="h-4 w-4" />
              History
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full justify-start gap-2 mt-4">Back to site</Button>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
