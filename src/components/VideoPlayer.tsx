import { mediaUrl, VideoItem } from '../lib/api'

export default function VideoPlayer({ video, className = '' }: { video: VideoItem; className?: string }) {
  const isFile = video.source === 'upload' || video.provider === 'direct' || (!video.embedUrl && video.url)

  if (isFile && video.url) {
    return (
      <video
        className={`w-full h-full bg-black ${className}`}
        src={mediaUrl(video.url) || video.url}
        controls
        poster={mediaUrl(video.thumbnail) || undefined}
        preload="metadata"
      />
    )
  }

  if (video.embedUrl) {
    return (
      <iframe
        className={`w-full h-full bg-black ${className}`}
        src={video.embedUrl}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
      />
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center text-stone-500 text-sm">
      Нет источника видео
    </div>
  )
}
