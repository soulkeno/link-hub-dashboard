import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, User, Palette, Link2, Award } from "lucide-react";
import { AccountTab } from "@/components/dashboard/AccountTab";
import { CustomizeTab } from "@/components/dashboard/CustomizeTab";
import { LinksTab } from "@/components/dashboard/LinksTab";
import { BadgesTab } from "@/components/dashboard/BadgesTab";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const profileData = useProfile();

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  if (authLoading || profileData.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user || !profileData.profile) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border/50 bg-card/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6 h-14">
          <span className="font-display text-lg font-bold tracking-tight">
            kenos<span className="text-primary">.lol</span>
          </span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/${profileData.profile?.username}`)}>
              View Profile
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 md:px-6 py-8"
      >
        <h1 className="font-display text-2xl font-bold mb-6">Dashboard</h1>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-card border border-border/50 h-11 p-1">
            <TabsTrigger value="account" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <User className="h-4 w-4" /> Account
            </TabsTrigger>
            <TabsTrigger value="customize" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Palette className="h-4 w-4" /> Customize
            </TabsTrigger>
            <TabsTrigger value="links" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Link2 className="h-4 w-4" /> Links
            </TabsTrigger>
            <TabsTrigger value="badges" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Award className="h-4 w-4" /> Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <AccountTab profile={profileData.profile} user={user} />
          </TabsContent>
          <TabsContent value="customize">
            <CustomizeTab profile={profileData.profile} updateProfile={profileData.updateProfile} userId={user.id} />
          </TabsContent>
          <TabsContent value="links">
            <LinksTab
              socialLinks={profileData.socialLinks}
              addSocialLink={profileData.addSocialLink}
              removeSocialLink={profileData.removeSocialLink}
            />
          </TabsContent>
          <TabsContent value="badges">
            <BadgesTab
              badges={profileData.badges}
              toggleBadge={profileData.toggleBadge}
              userId={user.id}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Dashboard;
