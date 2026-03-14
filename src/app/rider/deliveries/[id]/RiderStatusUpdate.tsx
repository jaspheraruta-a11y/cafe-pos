"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

const statuses = ["confirmed", "preparing", "out_for_delivery", "delivered"] as const;

export function RiderStatusUpdate({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const currentIndex = statuses.indexOf(currentStatus as (typeof statuses)[0]);

  async function setStatus(status: string) {
    const supabase = createClient();
    await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", orderId);
    router.refresh();
  }

  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-coffee-700 mb-2">Update delivery status</p>
      <div className="flex flex-wrap gap-2">
        {statuses.map((s, i) => (
          <Button
            key={s}
            variant={currentStatus === s ? "default" : "outline"}
            size="sm"
            onClick={() => setStatus(s)}
            disabled={i < currentIndex}
          >
            {s.replace("_", " ")}
          </Button>
        ))}
      </div>
    </div>
  );
}
