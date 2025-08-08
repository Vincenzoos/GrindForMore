"use server"

import { Todo } from "@/types/custom"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { resolve } from "path"

// Actions used to handle server actions

export async function addTodo(formData:FormData) {
    // await new Promise((resolve) =>{
    //     // Simulate server processing
    //     setTimeout(resolve, 1000);
    // })
    const supabase = await createClient()
    // Could add more validation later
    const text = formData.get("todo") as string | null

    if (!text){
        throw new Error('Text is required')
    }

    const {data: {user}} = await supabase.auth.getUser()
    
    if(!user){
        throw new Error('Login is required')
    }

    const {error} = await supabase.from("todos").insert({
        task: text,
        user_id: user.id
    })

    if (error){
        throw new Error('Error adding todo task')
    }

    revalidatePath("/todos")
}

export async function deleteTodo(id:number) {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if(!user){
        throw new Error("Login required")
    }

    const {error} = await supabase.from("todos").delete().match({
        user_id: user.id,
        id: id,
    })

    if(error){
        throw new Error("Error deleting task")
    }

    revalidatePath("/todos")
}

export async function updateTodo(todo:Todo) {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if(!user){
        throw new Error("Login required")
    }

    const {error} = await supabase.from("todos").update(todo).match(
        {
            user_id: user.id,
            id: todo.id,
        }
    )

    if(error){
        throw new Error("Error updating task")
    }

    revalidatePath("/todos")
}