import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio: string;
  location: string;
  avatar_url: string;
  background_url: string;
  music_url: string;
  accent_color: string;
  text_color: string;
  bg_color: string;
  glow_username: boolean;
  glow_socials: boolean;
  glow_badges: boolean;
  view_count: number;
}

export interface SocialLink {
  id: string;
  user_id: string;
  platform: string;
  url: string;
  label: string;
  sort_order: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_name: string;
  badge_icon_url: string;
  is_custom: boolean;
  sort_order: number;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);

    const [profileRes, linksRes, badgesRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("social_links").select("*").eq("user_id", user.id).order("sort_order"),
      supabase.from("user_badges").select("*").eq("user_id", user.id).order("sort_order"),
    ]);

    if (profileRes.data) setProfile(profileRes.data as unknown as Profile);
    if (linksRes.data) setSocialLinks(linksRes.data as unknown as SocialLink[]);
    if (badgesRes.data) setBadges(badgesRes.data as unknown as UserBadge[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update(updates).eq("user_id", user.id);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      setProfile((p) => (p ? { ...p, ...updates } : p));
      toast.success("Profile updated");
    }
  };

  const addSocialLink = async (platform: string, url: string, label: string) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("social_links")
      .insert({ user_id: user.id, platform, url, label, sort_order: socialLinks.length })
      .select()
      .single();
    if (error) {
      toast.error("Failed to add link");
    } else {
      setSocialLinks((l) => [...l, data as unknown as SocialLink]);
      toast.success("Link added");
    }
  };

  const removeSocialLink = async (id: string) => {
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) {
      toast.error("Failed to remove link");
    } else {
      setSocialLinks((l) => l.filter((link) => link.id !== id));
    }
  };

  const toggleBadge = async (badgeName: string, iconUrl: string = "", isCustom: boolean = false) => {
    if (!user) return;
    const existing = badges.find((b) => b.badge_name === badgeName);
    if (existing) {
      const { error } = await supabase.from("user_badges").delete().eq("id", existing.id);
      if (!error) setBadges((b) => b.filter((badge) => badge.id !== existing.id));
    } else {
      const { data, error } = await supabase
        .from("user_badges")
        .insert({ user_id: user.id, badge_name: badgeName, badge_icon_url: iconUrl, is_custom: isCustom, sort_order: badges.length })
        .select()
        .single();
      if (!error && data) setBadges((b) => [...b, data as unknown as UserBadge]);
    }
  };

  return { profile, socialLinks, badges, loading, updateProfile, addSocialLink, removeSocialLink, toggleBadge, fetchProfile };
}
