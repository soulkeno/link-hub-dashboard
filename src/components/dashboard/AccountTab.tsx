import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile } from "@/hooks/useProfile";
import { User, Eye, Hash, AtSign } from "lucide-react";
import type { User as AuthUser } from "@supabase/supabase-js";

interface AccountTabProps {
  profile: Profile;
  user: AuthUser;
}

export function AccountTab({ profile, user }: AccountTabProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <AtSign className="h-4 w-4 text-primary" /> Username
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-display font-semibold">{profile.username}</p>
          <p className="text-xs text-muted-foreground mt-1">kenos.lol/{profile.username}</p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Display Name
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-display font-semibold">{profile.display_name || "Not set"}</p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" /> Profile Views
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-display font-bold text-primary">{profile.view_count}</p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Hash className="h-4 w-4 text-primary" /> User ID
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground font-mono break-all">{user.id}</p>
        </CardContent>
      </Card>
    </div>
  );
}
