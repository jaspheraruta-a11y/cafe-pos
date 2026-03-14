"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Product, Category } from "@/types/database";
import { House, ShoppingCart, Minus, Plus, Trash2, CupSoda, Cookie, Flame } from "lucide-react";
import Image from "next/image";

interface PosItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export default function PosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<PosItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    supabase.from("products").select("*").eq("is_available", true).order("sort_order").then(({ data }) => {
      if (data) setProducts(data);
    });
  }, [supabase]);

  function addToCart(p: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === p.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === p.id
            ? { ...i, quantity: i.quantity + 1, lineTotal: (i.quantity + 1) * i.unitPrice }
            : i
        );
      }
      return [...prev, { productId: p.id, productName: p.name, quantity: 1, unitPrice: p.price, lineTotal: p.price }];
    });
  }

  function updateQty(index: number, delta: number) {
    setCart((prev) => {
      const item = prev[index];
      const qty = Math.max(0, item.quantity + delta);
      if (qty === 0) return prev.filter((_, i) => i !== index);
      const next = [...prev];
      next[index] = { ...item, quantity: qty, lineTotal: qty * item.unitPrice };
      return next;
    });
  }

  const subtotal = cart.reduce((s, i) => s + i.lineTotal, 0);

  async function completeOrder() {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const { data: order } = await supabase
        .from("orders")
        .insert({
          status: "confirmed",
          order_type: "walkin",
          subtotal,
          discount_amount: 0,
          delivery_fee: 0,
          total: subtotal,
        })
        .select("id")
        .single();
      if (!order) throw new Error("Failed to create order");
      await supabase.from("order_items").insert(
        cart.map((i) => ({
          order_id: order.id,
          product_id: i.productId,
          product_name: i.productName,
          quantity: i.quantity,
          unit_price: i.unitPrice,
          line_total: i.lineTotal,
          addons: [],
        }))
      );
      await supabase.from("payments").insert({
        order_id: order.id,
        method: "cash",
        status: "paid",
        amount: subtotal,
        paid_at: new Date().toISOString(),
      });
      setCart([]);
      alert("Order completed. Receipt printed.");
    } catch (e) {
      alert("Error: " + (e instanceof Error ? e.message : "Unknown"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex flex-col md:flex-row">
      <div className="flex-1 overflow-auto p-4 border-r border-coffee-200">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-display text-xl font-bold text-coffee-950">POS</h1>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">View orders</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((p) => (
            <Card
              key={p.id}
              className="cursor-pointer hover:border-coffee-400 transition"
              onClick={() => addToCart(p)}
            >
              <CardContent className="p-3">
                <div className="aspect-square bg-coffee-100 rounded flex items-center justify-center mb-2">
                  {p.image_url ? (
                    <Image src={p.image_url} alt={p.name} width={100} height={100} className="w-full h-full object-cover rounded" />
                  ) : (
                    <House className="h-8 w-8 text-coffee-400" />
                  )}
                </div>
                <p className="font-medium text-coffee-900 text-sm truncate">{p.name}</p>
                <p className="text-xs text-coffee-600">{formatPrice(p.price)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-coffee-200 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-coffee-900">Current order</h2>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <div>
                <p className="font-medium text-coffee-900">{item.productName}</p>
                <p className="text-coffee-600">{formatPrice(item.unitPrice)} × {item.quantity}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(i, -1)}>−</Button>
                <span className="w-6 text-center">{item.quantity}</span>
                <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(i, 1)}>+</Button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <p className="flex justify-between font-semibold text-coffee-900 mb-4">
            Total <span>{formatPrice(subtotal)}</span>
          </p>
          <Button className="w-full" disabled={cart.length === 0 || loading} onClick={completeOrder}>
            {loading ? "Processing…" : "Complete order"}
          </Button>
        </div>
      </div>
    </div>
  );
}
