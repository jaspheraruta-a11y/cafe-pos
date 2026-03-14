import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

export default async function AdminRidersPage() {
  const supabase = await createClient();
  const { data: riders } = await supabase.from("riders").select("id, vehicle_type, is_available, total_deliveries, rating");

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-display text-2xl font-bold text-coffee-950 mb-6">Rider management</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Riders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!riders?.length ? (
            <p className="text-coffee-600">No riders registered. Riders sign up and are linked via profiles.</p>
          ) : (
            <ul className="space-y-3">
              {riders.map((r) => (
                <li key={r.id} className="flex justify-between items-center py-2 border-b border-coffee-100 last:border-0">
                  <span className="font-medium text-coffee-900">Rider</span>
                  <span className="text-coffee-600">{r.vehicle_type ?? "—"} · {r.total_deliveries} deliveries · {r.is_available ? "Available" : "Busy"}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
