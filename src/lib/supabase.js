import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wivioicznwyhmpbeqoib.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_BDs07J3DlUgYfFz6X-8qFw_JKf7zJsa';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
