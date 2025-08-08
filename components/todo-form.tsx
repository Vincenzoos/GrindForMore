"use client";

import { addTodo } from "@/app/todos/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { TodoOptimisticUpdate } from "./todo-list";
import { Todo } from "@/types/custom";

function FormContent() {
  // react hooks form
  const {pending} = useFormStatus();
  return (
    <>
      <Textarea
        minLength={4}
        name="todo"
        required
        placeholder="Add a new todo"
        // Prevent spamming creation of todo tasks, only one task added at a time
        disabled = {pending}
      />
      <Button type="submit" size="icon" className="min-w-10">
        <Send className="h-5 w-5" />
        <span className="sr-only">Submit Todo</span>
      </Button>
    </>
  );
}

export function TodoForm({optimisticUpdate}: {optimisticUpdate: TodoOptimisticUpdate}) {
  // React hooks
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <Card>
      <CardContent className="p-3">
        <form ref={formRef} 
        action={async (data) => {
          // Fake data for optimistic update
          const newTodo: Todo = {
            id: -1,
            inserted_at: "",
            is_complete: false,
            user_id: "",
            task: data.get("todo") as string
          }
          // Run reducer fuction with "create" action to perform optimistic update
          optimisticUpdate({action: "create", todo: newTodo})
          await addTodo(data)
          // reset the form (clear all fields) when item added
          formRef.current?.reset()
        }} className="flex gap-4">
          <FormContent />
        </form>
      </CardContent>
    </Card>
  );
}
