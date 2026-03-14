import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, formatDate } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-display text-2xl font-bold text-coffee-950 mb-6">My orders</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Order history
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!orders?.length ? (
            <p className="text-coffee-600">No orders yet.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((o) => (
                <li key={o.id}>
                  <Link href={`/dashboard/orders/${o.id}`}>
                    <div className="flex flex-wrap justify-between items-center p-4 rounded-lg border border-coffee-200 hover:bg-cream-100 transition">
                      <div>
                        <p className="font-medium text-coffee-900">{o.order_number}</p>
                        <p className="text-sm text-coffee-600">{formatDate(o.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-coffee-800">{formatPrice(o.total)}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-coffee-100 text-coffee-800 capitalize">
                          {o.status.replace("_", " ")}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">View details</Button>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
