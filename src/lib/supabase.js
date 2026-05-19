import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = 'https://nokfbmhcjzfeqxcladmd.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5va2ZibWhjanpmZXF4Y2xhZG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxODExNDksImV4cCI6MjA5NDc1NzE0OX0.5ZwgnqyCAaoNYqemNgLTBSKoFzJpFyAxSGQs5MYn5us'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)