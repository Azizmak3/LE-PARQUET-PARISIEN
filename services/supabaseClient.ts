import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
// Uses environment variables exposed via vite.config.ts
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Lead capture will not persist to database.');
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Lead Data Interface matching Supabase Schema
export interface LeadData {
  email: string;
  source: 'calculator' | 'renovator' | 'chatbot';
  phone?: string;
  zip_code?: string;
  service_type?: string;
  surface_area?: number;
  current_condition?: string;
  finish_preference?: string;
  estimated_price_min?: number;
  estimated_price_max?: number;
  estimated_duration?: string;
  renovation_style?: string;
  marketing_opt_in?: boolean;
  // Note: We skip storing large Base64 images directly in leads table to avoid payload limits
  // ideally these would go to Storage, but for now we just track the lead metadata
}

/**
 * Safely inserts a lead into the public.leads table.
 * Handles errors gracefully and returns the inserted data or error.
 */
export const insertLead = async (lead: LeadData) => {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return { error: 'Client not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select();

    if (error) {
      console.error('Error inserting lead:', error.message);
      return { error: error.message };
    }

    console.log('Lead captured successfully:', data);
    return { data };
  } catch (err: any) {
    console.error('Unexpected error capturing lead:', err);
    return { error: err.message || 'Unknown error' };
  }
};