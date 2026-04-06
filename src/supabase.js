import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vjuyguksfehgqgmeujzj.supabase.co'
const supabaseAnonKey = 'sb_publishable_eDpPsWHv2qVadhSYL_m3Zg_zoQNwRtS'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
