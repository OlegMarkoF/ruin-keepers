import { useEffect, useState, FormEvent } from 'react'
import { api, Album, mediaUrl } from '../lib/api'
import { Plus, Pencil, Trash2, X, Loader2, Upload, Image as ImageIcon } from 'lucide-react'

export default function AlbumsAdmin() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [selected, setSelected] = useState<Album | null>(null)
  const [editingMeta, setEditingMeta] = useState<Partial<Album> | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const load = () => api.getAlbums().then(setAlbums).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openAlbum = async (id: string) => {
    const album = await api.getAlbum(id)
    setSelected(album)
  }

  const handleCreate = async () => {
    const album = await api.createAlbum({ title: 'Новый альбом', date: new Date().toISOString().slice(0, 10) })
    load()
    setSelected(album)
    setEditingMeta({ ...album })
  }

  const handleSaveMeta = async (e: FormEvent) => {
    e.preventDefault()
    if (!editingMeta?.id) return
    const updated = await api.updateAlbum(editingMeta.id, {
      title: editingMeta.title,
      description: editingMeta.description,
      date: editingMeta.date,
    })
    setSelected(updated)
    setEditingMeta(null)
    load()
  }

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm('Удалить альбом и все фото?')) return
    await api.deleteAlbum(id)
    if (selected?.id === id) setSelected(null)
    load()
  }

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length || !selected) return
    setUploading(true)
    try {
      const { album } = await api.uploadPhotos(selected.id, files)
      setSelected(album)
      load()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    if (!selected || !confirm('Удалить фото?')) return
    await api.deletePhoto(selected.id, photoId)
    const album = await api.getAlbum(selected.id)
    setSelected(album)
    load()
  }

  if (loading) return <div className="text-stone-500">Загрузка…</div>

  // Album detail view
  if (selected) {
    return (
      <div>
        <button onClick={() => { setSelected(null); setEditingMeta(null) }} className="text-sm text-stone-500 hover:text-ruin-gold mb-4">
          ← Все альбомы
        </button>

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-3xl text-stone-100">{selected.title}</h1>
            <p className="text-sm text-stone-500 mt-1">
              {selected.date && new Date(selected.date).toLocaleDateString('ru-RU')} · {selected.photos?.length || 0} фото
            </p>
            {selected.description && <p className="text-sm text-stone-400 mt-2">{selected.description}</p>}
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setEditingMeta({ ...selected })} className="p-2 text-stone-400 hover:text-ruin-gold border border-stone-700 rounded-lg">
              <Pencil size={16} />
            </button>
            <button onClick={() => handleDeleteAlbum(selected.id)} className="p-2 text-stone-400 hover:text-red-400 border border-stone-700 rounded-lg">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Upload */}
        <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-stone-700 rounded-xl p-8 mb-6 cursor-pointer hover:border-ruin-gold/40 transition ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading ? (
            <Loader2 className="animate-spin text-ruin-gold" size={28} />
          ) : (
            <Upload className="text-stone-500" size={28} />
          )}
          <span className="text-sm text-stone-400">
            {uploading ? 'Загрузка…' : 'Нажмите или перетащите фото (до 30 файлов)'}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
        </label>

        {/* Photos grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {(selected.photos || []).map((photo) => (
            <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden bg-stone-800">
              <img src={mediaUrl(photo.url)!} alt={photo.originalName} className="w-full h-full object-cover" />
              <button
                onClick={() => handleDeletePhoto(photo.id)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        {(selected.photos || []).length === 0 && (
          <p className="text-center text-stone-500 text-sm py-10">Пока нет фотографий</p>
        )}

        {/* Edit meta modal */}
        {editingMeta && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-5 border-b border-stone-800">
                <h2 className="font-serif text-xl text-stone-100">Редактировать альбом</h2>
                <button onClick={() => setEditingMeta(null)} className="text-stone-400"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveMeta} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Название</label>
                  <input
                    value={editingMeta.title || ''}
                    onChange={(e) => setEditingMeta({ ...editingMeta, title: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Дата</label>
                  <input
                    type="date"
                    value={editingMeta.date || ''}
                    onChange={(e) => setEditingMeta({ ...editingMeta, date: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Описание</label>
                  <textarea
                    value={editingMeta.description || ''}
                    onChange={(e) => setEditingMeta({ ...editingMeta, description: e.target.value })}
                    rows={3}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingMeta(null)} className="px-4 py-2 text-sm text-stone-400">Отмена</button>
                  <button type="submit" className="bg-ruin-gold text-stone-950 text-sm font-medium px-4 py-2 rounded-lg">Сохранить</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Albums list
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-stone-100">Фотоальбомы</h1>
          <p className="text-sm text-stone-500 mt-1">Архив по выездам и событиям</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-ruin-gold text-stone-950 text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#d4b57a]"
        >
          <Plus size={16} /> Создать альбом
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {albums.map((album) => (
          <button
            key={album.id}
            onClick={() => openAlbum(album.id)}
            className="card-ruin rounded-xl overflow-hidden text-left group"
          >
            <div className="aspect-[4/3] bg-stone-800 relative flex items-center justify-center">
              {album.cover ? (
                <img src={mediaUrl(album.cover)!} alt="" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={32} className="text-stone-600" />
              )}
              <div className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded-full">
                {album.photos?.length || 0} фото
              </div>
            </div>
            <div className="p-4">
              <div className="font-medium text-stone-200 group-hover:text-ruin-gold transition truncate">{album.title}</div>
              <div className="text-xs text-stone-500 mt-0.5">
                {album.date && new Date(album.date).toLocaleDateString('ru-RU')}
              </div>
            </div>
          </button>
        ))}
      </div>
      {albums.length === 0 && <p className="text-stone-500 text-sm py-8 text-center">Нет альбомов</p>}
    </div>
  )
}
