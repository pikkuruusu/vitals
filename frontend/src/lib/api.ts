import { createSupabaseBrowserClient } from '$lib/supabase';

const API_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

async function getAuthHeader() {
  const supabase = createSupabaseBrowserClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session ? `Bearer ${session.access_token}` : null
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const authHeader = await getAuthHeader()

  if (!authHeader) {
    throw new ApiError(401, 'User is not authenticated')
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
      ...options.headers
    }
  })

  if (!response.ok) {
    throw new ApiError(response.status, `API error: ${response.status}`)
  }

  return response.json()
}
