'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { Provider } from '@supabase/supabase-js'
import { getURL } from '@/utils/helpers'

export async function emailLogin(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // redirect('/error')
    redirect('/login?message=Could not authenticate user')
  }
// Clear all cached data at the layout layer
  revalidatePath('/', 'layout')
  redirect('/todos')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    // redirect('/error')
    redirect('/login?Error signing up')
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

export async function oAuthSignIn(provider: Provider){
  if (!provider){
    return redirect('/login?message=Authentication provider not found')
  }

  const supabase = await createClient()
  // Tell provider to link to the route we set up in auth/callback/route.ts
  // More options to handle URL, see utils/helpers.ts
  const redirectUrl = getURL('/auth/callback')
  // If sign in successful, provider will return a data
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl
    }
  })

  if (error){
    redirect('/login?message=Fail to sign in with provider')
  }

  // redirect to data url from provider (probally callback url set)
  return redirect(data.url)
}