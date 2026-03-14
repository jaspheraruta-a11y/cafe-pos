import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return (
    <div className="p-6 md:p-8 max-w-xl">
      <h1 className="font-display text-2xl font-bold text-coffee-950 mb-6">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            email={user.email ?? ""}
            fullName={profile?.full_name ?? ""}
            phone={profile?.phone ?? ""}
            address={profile?.address ?? ""}
          />
        </CardContent>
      </Card>
    </div>
  );
}
