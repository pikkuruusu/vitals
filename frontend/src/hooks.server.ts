import { createSupabaseServerClient } from "$lib/supabase";
import { redirect } from '@sveltejs/kit'
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createSupabaseServerClient(
    event.request,
    new Response()
  )

  event.locals.getSession = async () => {
    const { data: { session } } = await event.locals.supabase.auth.getSession()
    return session
  }

  const session = await event.locals.getSession()
  const pathname = event.url.pathname

  const publicPaths = ['/login']
  const isPublicPath = publicPaths.includes(pathname)

  if (!session && !isPublicPath) {
    redirect(303, '/login')
  }

  if (session && pathname === '/login') {
    redirect(303, '/dashboard')
  }

  return resolve(event)
}
