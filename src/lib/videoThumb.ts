/** Берёт кадр из видеофайла или URL — для обложки загруженных роликов. */
export function captureVideoFrame(src: File | string, atSeconds = 1): Promise<File | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'

    let objectUrl: string | null = null
    if (src instanceof File) {
      objectUrl = URL.createObjectURL(src)
      video.src = objectUrl
    } else {
      video.src = src
    }

    const cleanup = () => {
      video.src = ''
      video.load()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }

    const fail = () => {
      cleanup()
      resolve(null)
    }

    const grab = () => {
      const w = video.videoWidth
      const h = video.videoHeight
      if (!w || !h) {
        fail()
        return
      }
      const canvas = document.createElement('canvas')
      const max = 1280
      const scale = Math.min(1, max / w)
      canvas.width = Math.round(w * scale)
      canvas.height = Math.round(h * scale)
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        fail()
        return
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => {
          cleanup()
          if (!blob) {
            resolve(null)
            return
          }
          resolve(new File([blob], 'thumb.jpg', { type: 'image/jpeg' }))
        },
        'image/jpeg',
        0.82
      )
    }

    video.addEventListener('loadeddata', () => {
      const duration = Number.isFinite(video.duration) ? video.duration : atSeconds
      const t = Math.min(Math.max(0.1, atSeconds), Math.max(0.1, duration * 0.15))
      try {
        video.currentTime = t
      } catch {
        grab()
      }
    })
    video.addEventListener('seeked', grab, { once: true })
    video.addEventListener('error', fail)
    setTimeout(fail, 12000)
  })
}
