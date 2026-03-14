import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import { Truck } from "lucide-react";

export default async function RiderDeliveriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: rider } = await supabase.from("riders").select("id").eq("user_id", user.id).single();
  const { data: orders } = rider
    ? await supabase.from("orders").select("id, order_number, status, total, delivery_address, created_at").eq("rider_id", rider.id).order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-display text-2xl font-bold text-coffee-950 mb-6">My deliveries</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Delivery list
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!orders?.length ? (
            <p className="text-coffee-600">No deliveries assigned yet.</p>
          ) : (
            <ul className="space-y-3">
              {orders.map((o) => (
                <li key={o.id}>
                  <Link href={`/rider/deliveries/${o.id}`}>
                    <div className="flex flex-wrap justify-between items-center p-4 rounded-lg border border-coffee-200 hover:bg-cream-100 transition">
                      <div>
                        <p className="font-medium text-coffee-900">{o.order_number}</p>
                        <p className="text-sm text-coffee-600">{formatDate(o.created_at)}</p>
                        {o.delivery_address && <p className="text-sm text-coffee-700 mt-1">{o.delivery_address}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-coffee-100 text-coffee-800 capitalize">{o.status.replace("_", " ")}</span>
                        <span className="font-semibold text-coffee-800">{formatPrice(o.total)}</span>
                        <Button variant="ghost" size="sm">Update status</Button>
                      </div>
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
