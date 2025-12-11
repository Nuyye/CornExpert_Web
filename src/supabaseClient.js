import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- TAMBAHIN INI BUAT NGECEK ---
console.log("Cek URL:", supabaseUrl);
console.log("Cek Key:", supabaseKey);
// --------------------------------

export const supabase = createClient(supabaseUrl, supabaseKey);
