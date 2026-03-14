"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { House } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100 px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-coffee-800 font-medium">Password updated. Redirecting to login…</p>
            <Button asChild className="mt-4">
              <Link href="/login">Log in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-display text-xl font-semibold text-coffee-800 mb-2">
            <House className="h-6 w-6 text-coffee-600" />
            AJ&apos;s Café
          </Link>
          <CardTitle>Set new password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating…" : "Update password"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-coffee-600">
            <Link href="/login" className="font-medium text-coffee-700 hover:underline">Back to Log in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
