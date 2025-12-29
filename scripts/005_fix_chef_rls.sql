-- Fix RLS for Menus and Menu Items to allow management for both anon and authenticated users
-- This is useful for demo/local development where authentication might not be fully configured

-- Menus
DROP POLICY IF EXISTS "Allow users to manage their own menus" ON public.menus;
DROP POLICY IF EXISTS "Enable all access for menus" ON public.menus;

CREATE POLICY "Enable all access for menus" 
ON public.menus 
FOR ALL 
TO anon, authenticated 
USING (true)
WITH CHECK (true);

-- Menu Items
DROP POLICY IF EXISTS "Allow users to manage their own menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Enable all access for menu items" ON public.menu_items;

CREATE POLICY "Enable all access for menu items" 
ON public.menu_items 
FOR ALL 
TO anon, authenticated 
USING (true)
WITH CHECK (true);
