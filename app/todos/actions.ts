"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

// Actions used to handle server actions

export async function addTodo(formData:FormData) {
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