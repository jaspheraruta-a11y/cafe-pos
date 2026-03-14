import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, formatDate } from "@/lib/utils";

const statusSteps = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(*),
      payments(*)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!order) notFound();

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <Link href="/dashboard/orders" className="text-sm text-coffee-600 hover:underline mb-4 inline-block">
        ← Back to orders
      </Link>
      <h1 className="font-display text-2xl font-bold text-coffee-950 mb-2">Order {order.order_number}</h1>
      <p className="text-coffee-600 mb-6">{formatDate(order.created_at)}</p>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {statusSteps.map((s, i) => (
          <div
            key={s}
            className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium ${
              i <= currentStep ? "bg-coffee-700 text-cream-50" : "bg-coffee-100 text-coffee-600"
            }`}
          >
            {s.replace("_", " ")}
          </div>
        ))}
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
