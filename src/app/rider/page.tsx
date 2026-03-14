import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Truck, DollarSign } from "lucide-react";

export default async function RiderDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: rider } = await supabase.from("riders").select("*").eq("user_id", user.id).single();
  const riderId = rider?.id;

  const { data: myDeliveries } = riderId
    ? await supabase.from("orders").select("id, order_number, status, total").eq("rider_id", riderId).in("status", ["out_for_delivery", "preparing"]).order("created_at", { ascending: false })
    : { data: [] };

  const { data: completed } = riderId
    ? await supabase.from("orders").select("total").eq("rider_id", riderId).eq("status", "delivered")
    : { data: [] };
  const earnings = completed?.reduce((s, o) => s + Number(o.total), 0) ?? 0;

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-display text-2xl font-bold text-coffee-950 mb-6">Rider dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-coffee-600">Active deliveries</CardTitle>
            <Truck className="h-4 w-4 text-coffee-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-coffee-950">{myDeliveries?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-coffee-600">Earnings (delivered)</CardTitle>
            <DollarSign className="h-4 w-4 text-coffee-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-coffee-950">{formatPrice(earnings)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Current deliveries</CardTitle>
          <Button asChild>
            <Link href="/rider/deliveries">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {!myDeliveries?.length ? (
            <p className="text-coffee-600">No active deliveries. Accept orders from the admin panel (assign rider).</p>
          ) : (
            <ul className="space-y-2">
              {myDeliveries.map((o) => (
                <li key={o.id} className="flex justify-between items-center py-2 border-b border-coffee-100">
                  <span className="font-medium text-coffee-900">{o.order_number}</span>
                  <span className="capitalize text-coffee-600">{o.status.replace("_", " ")}</span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/rider/deliveries/${o.id}`}>Update</Link>
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
