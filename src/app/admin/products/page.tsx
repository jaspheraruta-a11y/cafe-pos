import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Package } from "lucide-react";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, is_available, category_id")
    .order("sort_order");
  const { data: categories } = await supabase.from("categories").select("id, name");

  const catMap = new Map(categories?.map((c) => [c.id, c.name]) ?? []);

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-bold text-coffee-950">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Menu items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-coffee-200 text-left text-coffee-600">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Price</th>
                  <th className="pb-3 pr-4">Available</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {products?.map((p) => (
                  <tr key={p.id} className="border-b border-coffee-100">
                    <td className="py-3 pr-4 font-medium text-coffee-900">{p.name}</td>
                    <td className="py-3 pr-4">{p.category_id ? catMap.get(p.category_id) ?? "—" : "—"}</td>
                    <td className="py-3 pr-4">{formatPrice(p.price)}</td>
                    <td className="py-3 pr-4">{p.is_available ? "Yes" : "No"}</td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/products/${p.id}`}>Edit</Link>
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
