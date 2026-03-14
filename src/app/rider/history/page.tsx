import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, formatDate } from "@/lib/utils";
import { History } from "lucide-react";

export default async function RiderHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: rider } = await supabase.from("riders").select("id").eq("user_id", user.id).single();
  const { data: orders } = rider
    ? await supabase.from("orders").select("id, order_number, total, created_at").eq("rider_id", rider.id).eq("status", "delivered").order("created_at", { ascending: false }).limit(30)
    : { data: [] };

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-display text-2xl font-bold text-coffee-950 mb-6">Delivery history</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Completed deliveries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!orders?.length ? (
            <p className="text-coffee-600">No completed deliveries yet.</p>
          ) : (
            <ul className="space-y-2">
              {orders.map((o) => (
                <li key={o.id} className="flex justify-between items-center py-2 border-b border-coffee-100">
                  <span className="font-medium text-coffee-900">{o.order_number}</span>
                  <span className="text-coffee-600">{formatDate(o.created_at)}</span>
                  <span className="font-semibold text-coffee-800">{formatPrice(o.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
