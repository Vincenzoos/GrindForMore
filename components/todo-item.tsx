'use client'

import { deleteTodo, updateTodo } from "@/app/todos/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Todo } from "@/types/custom";
import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { TodoOptimisticUpdate } from "./todo-list";
import { useState } from "react";

export function TodoItem({ todo, optimisticUpdate }: { todo: Todo, optimisticUpdate: TodoOptimisticUpdate }) {
  return (
    <form>
      <TodoCard optimisticUpdate={optimisticUpdate} todo={todo} />
    </form>
  );
}

export function TodoCard({ todo, optimisticUpdate }: { todo: Todo, optimisticUpdate: TodoOptimisticUpdate }) {
  const {pending} = useFormStatus()
  // Set what checked attribute of check box to whatever todo.is_complete currently is
  const [checked, setChecked] = useState(todo.is_complete)
  return (
    <Card className={cn("w-full", pending && "opacity-50")}>
      <CardContent className="flex items-start gap-3 p-3">
        <span className="size-10 flex items-center justify-center">
          <Checkbox 
          // checked={Boolean(todo.is_complete)} 
          // checked={Boolean (checked)} 
          type="submit"
          checked={Boolean (todo.is_complete)} 
          // onCheckedChange={async (val) =>{
          //   // Prevent acidental updates when checkbox in ambiguous state
          //   if (val === "indeterminate") return
          //   setChecked(val)
          //   // ...object: spread syntax for objects, uses to create a new object with all properties of the old object
          //   await updateTodo({...todo, is_complete: val});
          // }} />
          // optimistic update for checkbox
          formAction={async () =>{
            // Optimistic update for checkbox
            optimisticUpdate({
              action: "update",
              todo: {...todo, is_complete: !todo.is_complete}
            })
            // ...object: spread syntax for objects, uses to create a new object with all properties of the old object
            await updateTodo({...todo, is_complete: !todo.is_complete});
          }} />
        </span>
        <p className={cn("flex-1 pt-2 min-w-0 break-words")}>{todo.task }</p>
        <Button disabled = {pending} formAction={async (data) => {
          // Run reducer fuction with "create" action to perform optimistic update
          optimisticUpdate({action: "delete", todo: todo})
          await deleteTodo(todo.id)
        }} variant="ghost" size="icon">
          <Trash2 className="h-5 w-5" />
          <span className="sr-only">Delete Todo</span>
        </Button>
      </CardContent>
    </Card>
  );
}
