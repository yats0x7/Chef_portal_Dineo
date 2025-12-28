-- Allow anonymous users to INSERT into orders
CREATE POLICY "Enable insert for customers" 
ON public.orders 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow anonymous users to SELECT orders (needed for realtime and status updates)
CREATE POLICY "Enable access for customers" 
ON public.orders 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow anonymous users to INSERT into order_items
CREATE POLICY "Enable insert for customers items" 
ON public.order_items 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow anonymous users to SELECT order_items
CREATE POLICY "Enable select for customers items" 
ON public.order_items 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow anonymous users to READ menu items (to see the menu)
CREATE POLICY "Enable read access for public menus" 
ON public.menus 
FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Enable read access for public menu items" 
ON public.menu_items 
FOR SELECT 
TO anon, authenticated 
USING (true);
