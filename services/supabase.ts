import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wfvmmhfhcmltidzlhppk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indmdm1taGZoY21sdGlkemxocHBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNDM0NDQsImV4cCI6MjA4MzYxOTQ0NH0.WB_D9BloHghYznEMcVcB8deSMeBGu07ijptkBN9Kg_Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);