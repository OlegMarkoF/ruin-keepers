import { useEffect, useState, FormEvent } from 'react'
import { api, VideoItem, mediaUrl } from '../lib/api'
import { parseEmbed, videoCategoryLabels, videoProviderLabels } from '../lib/embed'
import { captureVideoFrame } from '../lib/videoThumb'
import VideoPlayer from '../components/VideoPlayer'
import { Plus, Pencil, Trash2, X, Loader2, Upload } from 'lucide-react'

const empty: Partial<VideoItem> = {
  title: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
  category: 'trip',
  source: 'embed',
  url: '',
  embedUrl: null,
  provider: 'other',
  thumbnail: null,
  filename: null,
  status: 'published',
}

export default function VideosAdmin() {
  const [items, setItems] = useState<VideoItem[]>([])
  const [editing, setEditing] = useState<Partial<VideoItem> | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [thumbFile, setThumbFile] = useState<File | null>(null)
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)
  const [thumbBusy, setThumbBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = () => api.getVideos().then(setItems).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const parsed = editing?.source === 'embed' && editing.url ? parseEmbed(editing.url) : null

  const applyThumb = (f: File | null) => {
    setThumbFile(f)
    setThumbPreview(f ? URL.createObjectURL(f) : null)
  }

  const handlePickVideo = async (picked: File | null) => {
    setFile(picked)
    if (!picked) return
    setThumbBusy(true)
    try {
      const frame = await captureVideoFrame(picked)
      if (frame) applyThumb(frame)
    } finally {
      setThumbBusy(false)
    }
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!editing) return
    if (editing.source === 'embed' && !editing.url) {
      alert('Вставьте ссылку на видео')
      return
    }
    if (editing.source === 'upload' && !editing.id && !file) {
      alert('Выберите видеофайл')
      return
    }
    setSaving(true)
    try {
      let autoThumb = thumbFile
      if (editing.source === 'upload' && !autoThumb && !editing.thumbnail) {
        const src = file || (editing.url ? mediaUrl(editing.url) : null)
        if (src) autoThumb = await captureVideoFrame(src)
      }

      const payload: Partial<VideoItem> = { ...editing }
      if (editing.source === 'embed' && editing.url) {
        const p = parseEmbed(editing.url)
        payload.provider = p.provider
        payload.embedUrl = p.embedUrl
        payload.url = p.url
        if (!payload.thumbnail && p.thumbnail) payload.thumbnail = p.thumbnail
      }

      if (autoThumb) {
        const up = await api.upload(autoThumb)
        payload.thumbnail = up.url
      }

      let saved: VideoItem
      if (editing.id) saved = await api.updateVideo(editing.id, payload)
      else saved = await api.createVideo(payload)

      if (file) await api.uploadVideoFile(saved.id, file)

      setEditing(null)
      setFile(null)
      applyThumb(null)
      load()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить видео?')) return
    await api.deleteVideo(id)
    load()
  }

  const openEditor = (item?: VideoItem) => {
    setFile(null)
    applyThumb(null)
    setEditing(item ? { ...item } : { ...empty })
  }

  if (loading) return <div className="text-stone-500">Загрузка…</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-stone-100">Видео</h1>
          <p className="text-sm text-stone-500 mt-1">Архив роликов, выезды, анонсы. Файл или ссылка YouTube / VK / Rutube</p>
        </div>
        <button
          onClick={() => openEditor()}
          className="flex items-center gap-2 bg-ruin-gold text-stone-950 text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#d4b57a]"
        >
          <Plus size={16} /> Добавить
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="card-ruin rounded-xl p-4 flex items-center gap-4">
            <div className="w-28 aspect-video rounded-lg overflow-hidden bg-stone-800 shrink-0">
              {item.thumbnail ? (
                <img src={mediaUrl(item.thumbnail)!} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-500">
                  {videoProviderLabels[item.provider] || item.provider}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-stone-200 font-medium truncate">{item.title}</div>
              <div className="text-xs text-stone-500 mt-0.5">
                {item.date && new Date(item.date).toLocaleDateString('ru-RU')} · {videoCategoryLabels[item.category] || item.category} · {videoProviderLabels[item.provider] || item.provider}
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${
              item.status === 'published' ? 'border-green-800 text-green-500' : 'border-stone-600 text-stone-500'
            }`}>
              {item.status === 'published' ? 'на сайте' : 'черновик'}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => openEditor(item)} className="p-2 text-stone-400 hover:text-ruin-gold">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-stone-400 hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-stone-500 text-sm py-8 text-center">Нет видео</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-stone-800">
              <h2 className="font-serif text-xl text-stone-100">
                {editing.id ? 'Редактировать видео' : 'Новое видео'}
              </h2>
              <button onClick={() => setEditing(null)} className="text-stone-400 hover:text-stone-200">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-stone-500 mb-1">Название</label>
                <input
                  value={editing.title || ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Дата</label>
                  <input
                    type="date"
                    value={editing.date || ''}
                    onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Раздел</label>
                  <select
                    value={editing.category || 'trip'}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value as VideoItem['category'] })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
                  >
                    {Object.entries(videoCategoryLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1">Источник</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, source: 'embed' })}
                    className={`px-3 py-2 rounded-lg text-sm border ${
                      editing.source === 'embed'
                        ? 'border-ruin-gold text-ruin-gold bg-ruin-gold/10'
                        : 'border-stone-700 text-stone-400'
                    }`}
                  >
                    Ссылка (YouTube, VK…)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, source: 'upload' })}
                    className={`px-3 py-2 rounded-lg text-sm border ${
                      editing.source === 'upload'
                        ? 'border-ruin-gold text-ruin-gold bg-ruin-gold/10'
                        : 'border-stone-700 text-stone-400'
                    }`}
                  >
                    Загрузить файл
                  </button>
                </div>
              </div>

              {editing.source === 'embed' ? (
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Ссылка или код встраивания</label>
                  <textarea
                    value={editing.url || ''}
                    onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                    rows={3}
                    placeholder="https://youtu.be/...  или  https://vk.com/video-...  или iframe"
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
                  />
                  {parsed?.provider && parsed.provider !== 'other' && (
                    <p className="text-xs text-ruin-gold mt-1">
                      Распознано: {videoProviderLabels[parsed.provider]}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-stone-700 rounded-xl p-6 cursor-pointer hover:border-ruin-gold/40">
                    <Upload className="text-stone-500" size={22} />
                    <span className="text-sm text-stone-400 text-center">
                      {file
                        ? `${file.name} (${Math.round(file.size / 1024 / 1024)} МБ)`
                        : editing.filename
                          ? `Текущий файл: ${editing.filename}. Можно заменить`
                          : 'mp4, webm, mov — до 400 МБ'}
                    </span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime,.mp4,.webm,.mov,.m4v"
                      className="hidden"
                      onChange={(e) => handlePickVideo(e.target.files?.[0] || null)}
                    />
                  </label>
                  {thumbBusy && (
                    <p className="text-xs text-stone-500 mt-2 flex items-center gap-1.5">
                      <Loader2 size={12} className="animate-spin" /> Снимаем кадр для обложки…
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs text-stone-500 mb-1">Описание</label>
                <textarea
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1">Обложка</label>
                {(thumbPreview || editing.thumbnail) && (
                  <img
                    src={thumbPreview || mediaUrl(editing.thumbnail)!}
                    alt=""
                    className="w-full aspect-video object-cover rounded-lg mb-2 bg-stone-800"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => applyThumb(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-stone-400"
                />
                <p className="text-[11px] text-stone-600 mt-1">
                  Для файла с диска кадр берётся сам. Можно заменить своей картинкой.
                </p>
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1">Статус</label>
                <select
                  value={editing.status || 'published'}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value as VideoItem['status'] })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
                >
                  <option value="published">На сайте</option>
                  <option value="draft">Черновик</option>
                </select>
              </div>

              {(parsed?.embedUrl || (editing.source === 'upload' && (file || editing.url))) && (
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <VideoPlayer
                    video={{
                      ...(editing as VideoItem),
                      id: editing.id || 'preview',
                      title: editing.title || '',
                      embedUrl: parsed?.embedUrl || editing.embedUrl || null,
                      url: editing.source === 'upload' && file ? URL.createObjectURL(file) : (editing.url || ''),
                      provider: parsed?.provider || editing.provider || 'other',
                      source: editing.source || 'embed',
                      createdAt: '',
                      updatedAt: '',
                    }}
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-stone-400">Отмена</button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-ruin-gold text-stone-950 text-sm font-medium px-4 py-2 rounded-lg inline-flex items-center gap-2"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
