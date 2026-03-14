"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { House } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100 px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-coffee-800 font-medium">Check your email for a link to reset your password.</p>
            <Button asChild className="mt-4">
              <Link href="/login">Back to Log in</Link>
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
          <CardTitle>Forgot password</CardTitle>
          <CardDescription>Enter your email and we’ll send you a reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending…" : "Send reset link"}
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
