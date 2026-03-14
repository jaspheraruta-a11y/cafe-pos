import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusSelect } from "../OrderStatusSelect";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(*),
      payments(*)
    `)
    .eq("id", id)
    .single();

  if (!order) notFound();

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <Link href="/admin/orders" className="text-sm text-coffee-600 hover:underline mb-4 inline-block">
        ← Back to orders
      </Link>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-coffee-950">Order {order.order_number}</h1>
          <p className="text-coffee-600">{formatDate(order.created_at)} · {order.order_type}</p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {(order.order_items || []).map((item: { id: string; product_name: string; quantity: number; unit_price: number; line_total: number }) => (
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

      {(order.delivery_address || order.customer_notes) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-coffee-700">
            {order.delivery_address && <p><strong>Address:</strong> {order.delivery_address}</p>}
            {order.customer_notes && <p><strong>Notes:</strong> {order.customer_notes}</p>}
          </CardContent>
        </Card>
      )}

      {order.payments?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="capitalize">{order.payments[0].method} — {order.payments[0].status}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
