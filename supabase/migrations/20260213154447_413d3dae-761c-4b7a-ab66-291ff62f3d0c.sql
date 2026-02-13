
-- Create projects table for Minecraft content
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('texture_pack', 'plugin', 'modpack')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  icon_url TEXT DEFAULT '',
  file_url TEXT DEFAULT '',
  download_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  minecraft_versions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Anyone can view published projects (or own drafts)
CREATE POLICY "Anyone can view published projects" ON public.projects FOR SELECT USING (status = 'published' OR auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage buckets for project files and icons
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('project-icons', 'project-icons', true) ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view project files" ON storage.objects FOR SELECT USING (bucket_id IN ('project-files', 'project-icons'));
CREATE POLICY "Auth users can upload project files" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('project-files', 'project-icons') AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own project files" ON storage.objects FOR UPDATE USING (bucket_id IN ('project-files', 'project-icons') AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own project files" ON storage.objects FOR DELETE USING (bucket_id IN ('project-files', 'project-icons') AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to increment download count
CREATE OR REPLACE FUNCTION public.increment_download_count(project_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.projects SET download_count = download_count + 1 WHERE id = project_id;
END;
$$;
