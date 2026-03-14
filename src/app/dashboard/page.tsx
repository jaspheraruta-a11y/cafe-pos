import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, formatDate } from "@/lib/utils";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-display text-2xl font-bold text-coffee-950 mb-6">Dashboard</h1>
      <p className="text-coffee-700 mb-8">Welcome back. Here’s a quick overview of your orders.</p>

      <div className="flex flex-wrap gap-4 mb-8">
        <Button asChild>
          <Link href="/order" className="gap-2">
            Order now <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Recent orders
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/orders">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {!orders?.length ? (
            <p className="text-coffee-600">No orders yet. Place your first order from the menu.</p>
          ) : (
            <ul className="space-y-3">
              {orders.map((o) => (
                <li key={o.id} className="flex justify-between items-center py-2 border-b border-coffee-100 last:border-0">
                  <div>
                    <p className="font-medium text-coffee-900">{o.order_number}</p>
                    <p className="text-sm text-coffee-600">{formatDate(o.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-coffee-800">{formatPrice(o.total)}</p>
                    <p className="text-sm capitalize text-coffee-600">{o.status.replace("_", " ")}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/orders/${o.id}`}>View</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
