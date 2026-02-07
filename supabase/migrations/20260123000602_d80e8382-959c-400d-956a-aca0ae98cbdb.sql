-- Fix security warnings

-- 1. Fix update_updated_at_column function search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. The "RLS Policy Always True" warning is about anon_insert_leads which uses WITH CHECK (true)
-- This is intentional for public lead submission - we want anyone to submit leads
-- However, we should add some constraint to prevent abuse

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "anon_insert_leads" ON public.leads;

-- Create a more restrictive policy that still allows public inserts
-- but requires that the insert includes required fields
CREATE POLICY "anon_insert_leads" 
  ON public.leads 
  FOR INSERT 
  TO anon
  WITH CHECK (
    name IS NOT NULL AND 
    name <> '' AND 
    phone IS NOT NULL AND 
    phone <> '' AND
    service IS NOT NULL AND
    location IS NOT NULL AND
    message IS NOT NULL
  );