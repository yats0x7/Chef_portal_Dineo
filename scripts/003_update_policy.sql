-- Allow anonymous users (Chef) to UPDATE orders (especially status)
CREATE POLICY "Enable update for customers" 
ON public.orders 
FOR UPDATE
TO anon, authenticated 
USING (true)
WITH CHECK (true);
