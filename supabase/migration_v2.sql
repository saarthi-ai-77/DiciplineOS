-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL CHECK (char_length(name) > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own projects"
ON public.projects
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Create Join Table for Logs and Projects
CREATE TABLE IF NOT EXISTS public.log_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_id UUID REFERENCES public.daily_logs(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    hours INTEGER NOT NULL CHECK (hours >= 0),
    
    -- Ensure unique project per log
    UNIQUE(log_id, project_id)
);

-- Enable RLS for log_projects
ALTER TABLE public.log_projects ENABLE ROW LEVEL SECURITY;

-- Note: We join with daily_logs to verify ownership
CREATE POLICY "Users can manage their own log_projects"
ON public.log_projects
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.daily_logs 
        WHERE id = log_projects.log_id AND user_id = auth.uid()
    )
);

-- 3. Create Custom Disciplines Table
CREATE TABLE IF NOT EXISTS public.custom_disciplines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL CHECK (char_length(name) > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for custom_disciplines
ALTER TABLE public.custom_disciplines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own custom_disciplines"
ON public.custom_disciplines
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Update daily_logs table to support custom disciplines results
-- We use JSONB for flexibility while keeping the main table schema stable
ALTER TABLE public.daily_logs ADD COLUMN IF NOT EXISTS custom_results JSONB DEFAULT '{}'::jsonb;
