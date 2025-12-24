-- 1. Create the daily_logs table
CREATE TABLE IF NOT EXISTS public.daily_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    outreach_done BOOLEAN DEFAULT false,
    delivery_done BOOLEAN DEFAULT false,
    build_hours INTEGER DEFAULT 0,
    learning_hours INTEGER DEFAULT 0,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Enforce ONE log per user per day
    UNIQUE(user_id, date)
);

-- 2. Add constraint for note length
ALTER TABLE public.daily_logs ADD CONSTRAINT note_length CHECK (char_length(note) <= 140);

-- 3. Enable Row Level Security
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Users can INSERT only their own rows
CREATE POLICY "Users can insert their own logs" 
ON public.daily_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can SELECT only their own rows
CREATE POLICY "Users can view their own logs" 
ON public.daily_logs 
FOR SELECT 
USING (auth.uid() = user_id);

-- Note: No UPDATE or DELETE policies means they are immutable by default as per requirements.
