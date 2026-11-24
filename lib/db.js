import { createClient } from "@supabase/supabase-js";

let client;
function get() {
  client ??= createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  return client;
}

export const db = {
  from: (table) => get().from(table),
};
