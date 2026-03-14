"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForm({
  email,
  fullName,
  phone,
  address,
}: {
  email: string;
  fullName: string;
  phone: string;
  address: string;
}) {
  const [name, setName] = useState(fullName);
  const [ph, setPh] = useState(phone);
  const [addr, setAddr] = useState(address);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      full_name: name,
      phone: ph || null,
      address: addr || null,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    if (error) setMessage(error.message);
    else setMessage("Saved.");
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={email} disabled className="bg-cream-200" />
      </div>
      <div className="space-y-2">
        <Label>Full name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <Input value={ph} onChange={(e) => setPh(e.target.value)} placeholder="+63..." />
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Delivery address" />
      </div>
      {message && <p className="text-sm text-coffee-600">{message}</p>}
      <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
    </form>
  );
}
