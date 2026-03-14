"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { House } from "lucide-react";

export default function CheckoutPage() {
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "gcash" | "card">("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const { items, subtotal, clearCart } = useCart();

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }
    if (items.length === 0) {
      setError("Cart is empty.");
      setLoading(false);
      return;
    }
    try {
      const orderRes = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          status: "pending",
          order_type: "online",
          subtotal: subtotal(),
          discount_amount: 0,
          delivery_fee: 0,
          total: subtotal(),
          delivery_address: address || null,
          customer_notes: notes || null,
        })
        .select("id")
        .single();
      if (orderRes.error) throw orderRes.error;
      const orderId = orderRes.data.id;
      await supabase.from("order_items").insert(
        items.map((i) => ({
          order_id: orderId,
          product_name: i.productName,
          size: i.size,
          quantity: i.quantity,
          unit_price: i.unitPrice,
          addons: i.addons,
          notes: i.notes,
          line_total: i.lineTotal,
        }))
      );
      await supabase.from("payments").insert({
        order_id: orderId,
        method: paymentMethod,
        status: "pending",
        amount: subtotal(),
      });
      clearCart();
      router.push(`/dashboard/orders?placed=${orderId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream-50 px-4">
        <p className="text-coffee-700 mb-4">Your cart is empty.</p>
        <Button asChild><Link href="/order">Browse menu</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-coffee-200 bg-white">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Link href="/order" className="flex items-center gap-2 font-display font-semibold text-coffee-800">
            <House className="h-5 w-5" />
            AJ&apos;s Café
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="font-display text-2xl font-bold text-coffee-950 mb-6">Checkout</h1>
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label>Delivery address</Label>
            <Input
              placeholder="Street, Barangay, City"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Input
              placeholder="Special instructions"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Payment method</Label>
            <div className="flex gap-4">
              {(["cod", "gcash", "card"] as const).map((m) => (
                <label key={m} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === m}
                    onChange={() => setPaymentMethod(m)}
                    className="text-coffee-600"
                  />
                  <span className="capitalize">{m === "cod" ? "Cash on delivery" : m}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-coffee-200 p-4 bg-white">
            <p className="flex justify-between font-semibold text-coffee-900">
              Total <span>{formatPrice(subtotal())}</span>
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Placing order…" : "Place order"}
          </Button>
        </form>
      </main>
    </div>
  );
}
