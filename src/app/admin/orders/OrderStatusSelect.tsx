"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const statuses = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"] as const;

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();

  async function handleChange(value: string) {
    const supabase = createClient();
    await supabase.from("orders").update({ status: value, updated_at: new Date().toISOString() }).eq("id", orderId);
    router.refresh();
  }

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded border border-coffee-200 bg-white px-2 py-1 text-sm text-coffee-800 capitalize"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{s.replace("_", " ")}</option>
      ))}
    </select>
  );
}
