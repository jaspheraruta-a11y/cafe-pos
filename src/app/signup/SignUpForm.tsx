"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { House } from "lucide-react";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const redirect = searchParams.get('redirect') || '/dashboard';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (signUpError) throw signUpError;
      setSuccess(true);
      setTimeout(() => router.push(`/login?redirect=${encodeURIComponent(redirect)}`), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100 px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-coffee-800 font-medium">Account created. Check your email to confirm, then log in.</p>
            <Button asChild className="mt-4">
              <Link href={`/login?redirect=${encodeURIComponent(redirect)}`}>Go to Log in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-display text-xl font-semibold text-coffee-800 mb-2">
            <House className="h-6 w-6 text-coffee-600" />
            AJ&apos;s Café
          </Link>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Create an account to place orders and track deliveries.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Juan Dela Cruz"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
              {loading ? "Creating account…" : "Sign up"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-coffee-600">
            Already have an account?{" "}
            <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="font-medium text-coffee-700 hover:underline">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
