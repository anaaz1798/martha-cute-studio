import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vjuyguksfehgqgmeujzj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqdXlndWtzZmVoZ3FnbWV1anpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDQ1ODIsImV4cCI6MjA5MDkyMDU4Mn0.LsgHIQSDHpSPtLYpe8z75rrCO42TH0G2Gi-zsfe4c7I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
