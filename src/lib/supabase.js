import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_KEY

if (!url || !key) {
  console.warn('Supabase env vars missing — submissions will fail.')
}

export const supabase = createClient(url, key)
