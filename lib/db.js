import { createClient } from "@supabase/supabase-js";

let client;
export const db = new Proxy(
  {},
  {
    get(_, prop) {
      client ??= createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      });
      return client[prop];
    },
  }
);
