import { useEffect, useState, FormEvent } from 'react'
import { api, EventItem } from '../lib/api'
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react'

const empty: Partial<EventItem> = {
  title: '',
  date: new Date().toISOString().slice(0, 10),
  type: 'subbotnik',
  location: '',
  description: '',
  status: 'upcoming',
  volunteers: null,
}

const typeLabels: Record<string, string> = {
  subbotnik: 'Субботник',
  tour: 'Прогулка',
  lecture: 'Лекторий',
  festival: 'Фестиваль',
  other: 'Другое',
}

export default function EventsAdmin() {
  const [items, setItems] = useState<EventItem[]>([])
  const [editing, setEditing] = useState<Partial<EventItem> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = () => api.getEvents().then(setItems).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    try {
      if (editing.id) await api.updateEvent(editing.id, editing)
      else await api.createEvent(editing)
      setEditing(null)
      load()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить событие?')) return
    await api.deleteEvent(id)
    load()
  }

  if (loading) return <div className="text-stone-500">Загрузка…</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-stone-100">События</h1>
          <p className="text-sm text-stone-500 mt-1">Субботники, прогулки, лекторий</p>
        </div>
        <button
          onClick={() => setEditing({ ...empty })}
          className="flex items-center gap-2 bg-ruin-gold text-stone-950 text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#d4b57a]"
        >
          <Plus size={16} /> Создать
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="card-ruin rounded-xl p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-stone-200 font-medium truncate">{item.title}</div>
              <div className="text-xs text-stone-500 mt-0.5">
                {new Date(item.date).toLocaleDateString('ru-RU')} · {typeLabels[item.type] || item.type} · {item.location}
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${
              item.status === 'upcoming' ? 'border-ruin-gold/40 text-ruin-gold' : 'border-stone-600 text-stone-500'
            }`}>
              {item.status === 'upcoming' ? 'скоро' : 'прошло'}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setEditing({ ...item })} className="p-2 text-stone-400 hover:text-ruin-gold">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-stone-400 hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-stone-500 text-sm py-8 text-center">Нет событий</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-stone-800">
              <h2 className="font-serif text-xl text-stone-100">
                {editing.id ? 'Редактировать' : 'Новое событие'}
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
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Тип</label>
                  <select
                    value={editing.type || 'subbotnik'}
                    onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
                  >
                    {Object.entries(typeLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Место</label>
                <input
                  value={editing.location || ''}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Описание</label>
                <textarea
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Статус</label>
                  <select
                    value={editing.status || 'upcoming'}
                    onChange={(e) => setEditing({ ...editing, status: e.target.value as 'upcoming' | 'past' })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
                  >
                    <option value="upcoming">Предстоящее</option>
                    <option value="past">Прошедшее</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Волонтёров</label>
                  <input
                    type="number"
                    value={editing.volunteers ?? ''}
                    onChange={(e) => setEditing({ ...editing, volunteers: e.target.value ? Number(e.target.value) : null })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-stone-400">Отмена</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-ruin-gold text-stone-950 text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-60">
                  {saving && <Loader2 size={14} className="animate-spin" />} Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
