import { TodoList } from "@/components/todo-list";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function TodosPage() {
  const supabase = await createClient()
  const {data : { user }} = await supabase.auth.getUser()
  
  // If user not login, redirect to login page
  if(!user){
    return redirect("/login")
  }
  
  // const todos = ["This is a todo"];
  // Because of Row level security, dont need to select row that matches user id
  // Order by date created "insert_at"
  // List of todo objects
  const {data: todos} = await supabase
  .from("todos")
  .select()
  .order("inserted_at", {ascending: false})
  
  return (
    <section className="p-3 pt-6 max-w-2xl w-full flex flex-col gap-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Todo's
      </h1>
      <Separator className="w-full " />
      <TodoList todos={todos ?? []} />
    </section>
  );
}
