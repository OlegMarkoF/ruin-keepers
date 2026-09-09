export type VideoProvider = 'youtube' | 'vk' | 'rutube' | 'vimeo' | 'direct' | 'other'

export interface ParsedEmbed {
  provider: VideoProvider
  embedUrl: string | null
  thumbnail: string | null
  url: string
}

export function parseEmbed(raw: string): ParsedEmbed {
  const trimmed = (raw || '').trim()
  if (!trimmed) return { provider: 'other', embedUrl: null, thumbnail: null, url: '' }

  const fromIframe = trimmed.match(/src=["']([^"']+)["']/i)
  const url = fromIframe ? fromIframe[1] : trimmed

  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (yt) {
    return {
      provider: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${yt[1]}`,
      thumbnail: `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`,
      url,
    }
  }

  const rutube = url.match(/rutube\.ru\/(?:video|play\/embed)\/([a-zA-Z0-9]+)/)
  if (rutube) {
    return {
      provider: 'rutube',
      embedUrl: `https://rutube.ru/play/embed/${rutube[1]}`,
      thumbnail: null,
      url,
    }
  }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) {
    return {
      provider: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeo[1]}`,
      thumbnail: null,
      url,
    }
  }

  if (/video_ext\.php/.test(url)) {
    return { provider: 'vk', embedUrl: url, thumbnail: null, url }
  }

  const vk = url.match(/(?:vk\.(?:com|ru)|vkvideo\.ru)\/(?:video|clip)(-?\d+)_(\d+)/)
  if (vk) {
    return {
      provider: 'vk',
      embedUrl: `https://vk.com/video_ext.php?oid=${vk[1]}&id=${vk[2]}&hd=2`,
      thumbnail: null,
      url,
    }
  }

  const dzen = url.match(/dzen\.ru\/(?:video\/watch|embed)\/([a-zA-Z0-9]+)/)
  if (dzen) {
    return {
      provider: 'other',
      embedUrl: `https://dzen.ru/embed/${dzen[1]}`,
      thumbnail: null,
      url,
    }
  }


  if (/\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url)) {
    return { provider: 'direct', embedUrl: null, thumbnail: null, url }
  }

  return { provider: 'other', embedUrl: url, thumbnail: null, url }
}

export const videoCategoryLabels: Record<string, string> = {
  archive: 'Архив',
  trip: 'С выезда',
  announce: 'Анонс',
  lecture: 'Лекторий',
  other: 'Другое',
}

export const videoProviderLabels: Record<string, string> = {
  youtube: 'YouTube',
  vk: 'ВКонтакте',
  rutube: 'Rutube',
  vimeo: 'Vimeo',
  direct: 'Файл',
  other: 'Ссылка',
  upload: 'Файл',
}
