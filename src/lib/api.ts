const API = import.meta.env.VITE_API_URL || ''

function getToken() {
  return localStorage.getItem('rk_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Ошибка запроса')
  }
  return res.json()
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; email: string; name: string; role: string } }>(
      '/api/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),
  me: () => request<{ user: { id: string; email: string; name: string; role: string } }>('/api/auth/me'),

  getNews: (status?: string) =>
    request<NewsItem[]>(`/api/news${status ? `?status=${status}` : ''}`),
  getNewsItem: (id: string) => request<NewsItem>(`/api/news/${id}`),
  createNews: (data: Partial<NewsItem>) =>
    request<NewsItem>('/api/news', { method: 'POST', body: JSON.stringify(data) }),
  updateNews: (id: string, data: Partial<NewsItem>) =>
    request<NewsItem>(`/api/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNews: (id: string) =>
    request<{ ok: boolean }>(`/api/news/${id}`, { method: 'DELETE' }),

  getEvents: (status?: string) =>
    request<EventItem[]>(`/api/events${status ? `?status=${status}` : ''}`),
  createEvent: (data: Partial<EventItem>) =>
    request<EventItem>('/api/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id: string, data: Partial<EventItem>) =>
    request<EventItem>(`/api/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvent: (id: string) =>
    request<{ ok: boolean }>(`/api/events/${id}`, { method: 'DELETE' }),

  getAlbums: () => request<Album[]>(`/api/albums`),
  getAlbum: (id: string) => request<Album>(`/api/albums/${id}`),
  createAlbum: (data: Partial<Album>) =>
    request<Album>('/api/albums', { method: 'POST', body: JSON.stringify(data) }),
  updateAlbum: (id: string, data: Partial<Album>) =>
    request<Album>(`/api/albums/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAlbum: (id: string) =>
    request<{ ok: boolean }>(`/api/albums/${id}`, { method: 'DELETE' }),
  uploadPhotos: (albumId: string, files: FileList | File[]) => {
    const fd = new FormData()
    Array.from(files).forEach((f) => fd.append('photos', f))
    return request<{ photos: Photo[]; album: Album }>(`/api/albums/${albumId}/photos`, {
      method: 'POST',
      body: fd,
    })
  },
  deletePhoto: (albumId: string, photoId: string) =>
    request<{ ok: boolean }>(`/api/albums/${albumId}/photos/${photoId}`, { method: 'DELETE' }),

  upload: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return request<{ url: string; filename: string }>('/api/upload', { method: 'POST', body: fd })
  },
}

export interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover: string | null
  status: 'draft' | 'published'
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface EventItem {
  id: string
  title: string
  date: string
  type: string
  location: string
  description: string
  status: 'upcoming' | 'past'
  volunteers: number | null
  createdAt: string
  updatedAt: string
}

export interface Photo {
  id: string
  filename: string
  url: string
  originalName: string
  size: number
  uploadedAt: string
}

export interface Album {
  id: string
  title: string
  description: string
  cover: string | null
  date: string
  photos: Photo[]
  createdAt: string
  updatedAt: string
}

export function mediaUrl(url: string | null | undefined) {
  if (!url) return null
  if (url.startsWith('http')) return url
  const base = import.meta.env.VITE_API_URL || ''
  return `${base}${url}`
}
