import { Database } from "./supabase";

// Sepcify custom types as a row in a todos table in supabase
export type Todo = Database["public"]["Tables"]["todos"]["Row"]