import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, formatDate } from "@/lib/utils";
import { RiderStatusUpdate } from "./RiderStatusUpdate";

export default async function RiderDeliveryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: rider } = await supabase.from("riders").select("id").eq("user_id", user.id).single();
  if (!rider) notFound();

  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(*)
    `)
    .eq("id", id)
    .eq("rider_id", rider.id)
    .single();

  if (!order) notFound();

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <Link href="/rider/deliveries" className="text-sm text-coffee-600 hover:underline mb-4 inline-block">
        ← Back to deliveries
      </Link>
      <h1 className="font-display text-2xl font-bold text-coffee-950 mb-2">Order {order.order_number}</h1>
      <p className="text-coffee-600 mb-6">{formatDate(order.created_at)}</p>

      <RiderStatusUpdate orderId={order.id} currentStatus={order.status} />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {(order.order_items || []).map((item: { id: string; product_name: string; quantity: number; line_total: number }) => (
              <li key={item.id} className="flex justify-between text-coffee-800">
                <span>{item.product_name} × {item.quantity}</span>
                <span>{formatPrice(item.line_total)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t flex justify-between font-semibold text-coffee-900">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </CardContent>
      </Card>

      {order.delivery_address && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-coffee-800">{order.delivery_address}</p>
            {order.delivery_notes && <p className="text-sm text-coffee-600 mt-2">Notes: {order.delivery_notes}</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
