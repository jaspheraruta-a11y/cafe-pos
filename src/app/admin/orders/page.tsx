import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import { Receipt } from "lucide-react";
import { OrderStatusSelect } from "./OrderStatusSelect";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, status, total, order_type, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-display text-2xl font-bold text-coffee-950 mb-6">Order management</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-coffee-200 text-left text-coffee-600">
                  <th className="pb-3 pr-4">Order #</th>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((o) => (
                  <tr key={o.id} className="border-b border-coffee-100">
                    <td className="py-3 pr-4 font-medium text-coffee-900">{o.order_number}</td>
                    <td className="py-3 pr-4 capitalize">{o.order_type}</td>
                    <td className="py-3 pr-4">{formatPrice(o.total)}</td>
                    <td className="py-3 pr-4">
                      <OrderStatusSelect orderId={o.id} currentStatus={o.status} />
                    </td>
                    <td className="py-3 pr-4 text-coffee-600">{formatDate(o.created_at)}</td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/orders/${o.id}`}>View</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
