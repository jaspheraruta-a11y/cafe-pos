"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import type { Product, Category } from "@/types/database";
import { House, ShoppingCart, Minus, Plus, Trash2, CupSoda, Cookie, Flame } from "lucide-react";
import Image from "next/image";

export default function OrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
  const { items, addItem, updateQuantity, removeItem, clearCart, subtotal } = useCart();

  useEffect(() => {
    async function load() {
      const [catRes, prodRes, sessionData] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase.from("products").select("*").eq("is_available", true).order("sort_order"),
        supabase.auth.getSession(),
      ]);
      if (catRes.data) setCategories(catRes.data);
      if (prodRes.data) setProducts(prodRes.data);
      setSession(sessionData.data.session);
    }
    load();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const byCategory = categories.map((c) => ({
    ...c,
    products: products.filter((p) => p.category_id === c.id),
  }));

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="sticky top-0 z-40 border-b border-coffee-200 bg-cream-50/95 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-display font-semibold text-coffee-800">
            <House className="h-5 w-5" />
            AJ&apos;s Café
          </Link>
          <div className="flex items-center gap-2">
            {session ? (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.reload();
                }}
              >
                Sign out
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
            )}
            <Button size="sm" variant="outline" onClick={() => setCartOpen(true)} className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Cart ({items.length})
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-coffee-950 mb-6">Order</h1>
        {byCategory.map((cat) => (
          <section key={cat.id} className="mb-10">
            <h2 className="text-lg font-semibold text-coffee-800 mb-4">{cat.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.products.map((p) => (
                <Card key={p.id} className="overflow-hidden">
                  <div className="aspect-video bg-coffee-100 flex items-center justify-center">
                    {p.image_url ? (
                      <Image src={p.image_url} alt={p.name} width={100} height={100} className="w-full h-full object-cover" />
                    ) : (
                      <House className="h-12 w-12 text-coffee-400" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-coffee-900">{p.name}</h3>
                    <p className="text-sm text-coffee-600 mt-1">{p.description || "—"}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-semibold text-coffee-800">{formatPrice(p.price)}</span>
                      <Button
                        size="sm"
                        onClick={() =>
                          addItem({
                            productId: p.id,
                            productName: p.name,
                            size: null,
                            quantity: 1,
                            unitPrice: p.price,
                            addons: [],
                            notes: null,
                          })
                        }
                      >
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </main>

      {cartOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setCartOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-coffee-900">Your cart</h2>
              <Button variant="ghost" size="icon" onClick={() => setCartOpen(false)}>×</Button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {items.length === 0 ? (
                <p className="text-coffee-600">Cart is empty.</p>
              ) : (
                items.map((item, i) => (
                  <div key={i} className="flex justify-between items-start gap-2 border-b pb-3">
                    <div>
                      <p className="font-medium text-coffee-900">{item.productName}</p>
                      {item.size && <p className="text-sm text-coffee-600">{item.size}</p>}
                      <p className="text-sm text-coffee-600">{formatPrice(item.unitPrice)} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="outline" onClick={() => updateQuantity(i, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button size="icon" variant="outline" onClick={() => updateQuantity(i, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => removeItem(i)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t bg-cream-50">
              <p className="flex justify-between text-coffee-800 font-semibold">
                Subtotal <span>{formatPrice(subtotal())}</span>
              </p>
              <Button 
                className="w-full mt-4" 
                onClick={async () => {
                  setCartOpen(false);
                  try {
                    // Check authentication state
                    const { data: { session }, error } = await supabase.auth.getSession();
                    
                    if (error) {
                      console.error('Auth error:', error);
                      router.push('/signup?redirect=/checkout');
                      return;
                    }
                    
                    // Only consider authenticated if we have a valid session
                    if (!session || !session.user) {
                      router.push('/signup?redirect=/checkout');
                    } else {
                      router.push('/checkout');
                    }
                  } catch (err) {
                    console.error('Unexpected error during auth check:', err);
                    router.push('/signup?redirect=/checkout');
                  }
                }}
              >
                Proceed to checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
