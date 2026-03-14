import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "lucide-react";

export default async function AdminPromosPage() {
  const supabase = await createClient();
  const { data: promos } = await supabase.from("promos").select("*").order("created_at", { ascending: false });

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-display text-2xl font-bold text-coffee-950 mb-6">Promo codes</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Discounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!promos?.length ? (
            <p className="text-coffee-600">No promos. Add in Supabase or build an add form.</p>
          ) : (
            <ul className="space-y-3">
              {promos.map((p) => (
                <li key={p.id} className="flex justify-between items-center py-2 border-b border-coffee-100">
                  <div>
                    <p className="font-medium text-coffee-900">{p.code}</p>
                    <p className="text-sm text-coffee-600">{p.description} · {p.discount_type === "percent" ? `${p.discount_value}%` : `₱${p.discount_value}`}</p>
                  </div>
                  <span className={`text-sm ${p.is_active ? "text-green-600" : "text-coffee-500"}`}>
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
