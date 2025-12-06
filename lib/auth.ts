/**
 * Supabase authentication utilities
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client
export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // Server-side: use service role key
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  // Client-side: use anon key
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Get current user
export async function getCurrentUser() {
  const supabase = getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Sign in
export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// Sign up
export async function signUp(email: string, password: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

// Sign out
export async function signOut() {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}
