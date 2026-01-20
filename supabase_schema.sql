-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- LEADS TABLE
-- Captures data from both the "Calculator" and "Renovator" components
CREATE TABLE public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- CORE CONTACT INFO
    email TEXT NOT NULL,
    phone TEXT, -- Optional, captured if user provides it in future flows
    zip_code TEXT, -- Captured in Hero/Calculator
    
    -- SOURCE TRACKING
    source TEXT NOT NULL CHECK (source IN ('calculator', 'renovator', 'chatbot')),
    
    -- CALCULATOR DATA ("Quel est le prix réel de vos travaux ?")
    service_type TEXT,        -- e.g. "Rénovation", "Pose", "Dégâts des Eaux"
    surface_area NUMERIC,     -- e.g. 30
    current_condition TEXT,   -- e.g. "Bon", "Moyen", "Mauvais"
    finish_preference TEXT,   -- e.g. "Vitrification Mate"
    
    -- CALCULATED ESTIMATES (Snapshot of what was shown to user)
    estimated_price_min NUMERIC,
    estimated_price_max NUMERIC,
    estimated_duration TEXT,
    
    -- RENOVATOR DATA ("Visualisez votre futur parquet")
    renovation_style TEXT,    -- e.g. "vitrification-mat", "teinte-wenge"
    
    -- IMAGE STORAGE REFERENCES
    -- Note: Ideally upload images to Supabase Storage and save the public URL here.
    -- Storing full Base64 strings in DB is possible but not recommended for performance.
    original_image_url TEXT, 
    generated_image_url TEXT,
    
    -- LEAD STATUS
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'archived')),
    marketing_opt_in BOOLEAN DEFAULT FALSE
);

-- SECURITY POLICIES (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon) to insert leads (standard for landing pages)
CREATE POLICY "Enable insert for public" 
ON public.leads 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow only authenticated users (staff) to view leads
CREATE POLICY "Enable select for authenticated users only" 
ON public.leads 
FOR SELECT 
TO authenticated 
USING (true);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_leads_source ON public.leads(source);

-- COMMENT
COMMENT ON TABLE public.leads IS 'Centralized lead capture for Parquet Parisien renovation calculator and AI visualizer.';