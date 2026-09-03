import { useEffect, useState, FormEvent } from 'react'
import { api, NewsItem, mediaUrl } from '../lib/api'
import { Plus, Pencil, Trash2, X, Loader2, Upload } from 'lucide-react'

const empty: Partial<NewsItem> = {
  title: '',
  excerpt: '',
  content: '',
  status: 'draft',
  cover: null,
}

export default function NewsAdmin() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [editing, setEditing] = useState<Partial<NewsItem> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = () => api.getNews().then(setItems).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openNew = () => setEditing({ ...empty })
  const openEdit = (item: NewsItem) => setEditing({ ...item })

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    try {
      if (editing.id) {
        await api.updateNews(editing.id, editing)
      } else {
        await api.createNews(editing)
      }
      setEditing(null)
      load()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить новость?')) return
    await api.deleteNews(id)
    load()
  }

  const handleCover = async (file: File) => {
    try {
      const { url } = await api.upload(file)
      setEditing((prev) => prev ? { ...prev, cover: url } : prev)
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) return <div className="text-stone-500">Загрузка…</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-stone-100">Новости</h1>
          <p className="text-sm text-stone-500 mt-1">Анонсы и публикации</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-ruin-gold text-stone-950 text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#d4b57a]"
        >
          <Plus size={16} /> Создать
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="card-ruin rounded-xl p-4 flex items-center gap-4">
            {item.cover ? (
              <img src={mediaUrl(item.cover)!} alt="" className="w-16 h-12 object-cover rounded-lg shrink-0" />
            ) : (
              <div className="w-16 h-12 bg-stone-800 rounded-lg shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-stone-200 font-medium truncate">{item.title}</div>
              <div className="text-xs text-stone-500 mt-0.5">
                {item.status === 'published' ? 'Опубликовано' : 'Черновик'}
                {item.publishedAt && ` · ${new Date(item.publishedAt).toLocaleDateString('ru-RU')}`}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => openEdit(item)} className="p-2 text-stone-400 hover:text-ruin-gold">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-stone-400 hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-stone-500 text-sm py-8 text-center">Нет новостей</p>}
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-stone-800">
              <h2 className="font-serif text-xl text-stone-100">
                {editing.id ? 'Редактировать' : 'Новая новость'}
              </h2>
              <button onClick={() => setEditing(null)} className="text-stone-400 hover:text-stone-200">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-stone-500 mb-1">Заголовок</label>
                <input
                  value={editing.title || ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Краткое описание</label>
                <textarea
                  value={editing.excerpt || ''}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  rows={2}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Текст</label>
                <textarea
                  value={editing.content || ''}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  rows={6}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Обложка</label>
                <div className="flex items-center gap-3">
                  {editing.cover && (
                    <img src={mediaUrl(editing.cover)!} alt="" className="w-20 h-14 object-cover rounded-lg" />
                  )}
                  <label className="flex items-center gap-2 text-sm text-stone-400 border border-stone-700 rounded-lg px-3 py-2 cursor-pointer hover:border-ruin-gold/40">
                    <Upload size={14} /> Загрузить
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleCover(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Статус</label>
                <select
                  value={editing.status || 'draft'}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value as 'draft' | 'published' })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
                >
                  <option value="draft">Черновик</option>
                  <option value="published">Опубликовано</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-stone-400 hover:text-stone-200">
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-ruin-gold text-stone-950 text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#d4b57a] disabled:opacity-60"
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
