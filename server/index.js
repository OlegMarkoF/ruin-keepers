import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'ruin-keepers-secret-change-me-in-production'
const DATA_DIR = path.join(__dirname, 'data')
const UPLOADS_DIR = path.join(__dirname, 'uploads')

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use('/uploads', express.static(UPLOADS_DIR))

function readJSON(name, fallback = []) {
  const file = path.join(DATA_DIR, name)
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(fallback, null, 2))
    return fallback
  }
  return JSON.parse(fs.readFileSync(file, 'utf-8'))
}

function writeJSON(name, data) {
  fs.writeFileSync(path.join(DATA_DIR, name), JSON.stringify(data, null, 2))
}

function ensureAdmin() {
  const users = readJSON('users.json', [])
  if (users.length === 0) {
    const hash = bcrypt.hashSync('admin123', 10)
    users.push({
      id: uuidv4(),
      email: 'admin@ruin-keepers.ru',
      name: 'Администратор',
      passwordHash: hash,
      role: 'admin',
    })
    writeJSON('users.json', users)
    console.log('✓ Default admin created: admin@ruin-keepers.ru / admin123')
  }
}
ensureAdmin()

function seedIfEmpty() {
  const news = readJSON('news.json', null)
  if (news === null || !Array.isArray(news) || news.length === 0) {
    const now = new Date().toISOString()
    writeJSON('news.json', [
      {
        id: uuidv4(),
        title: '300-й выезд Хранителей!',
        slug: '300-vyezd',
        excerpt: 'Юбилейный субботник в Алленберге собрал 140 волонтёров.',
        content: 'В минувшую субботу состоялся 300-й выезд движения «Хранители руин». Легендарный комплекс Алленберг благодаря новым собственникам получает шанс на возрождение.\n\n140 волонтёров помогли привести в порядок территорию внутреннего двора.',
        cover: null,
        status: 'published',
        publishedAt: '2026-08-29T12:00:00.000Z',
        createdAt: now,
        updatedAt: now,
      },
    ])
  }

  const events = readJSON('events.json', null)
  if (events === null || !Array.isArray(events) || events.length === 0) {
    const now = new Date().toISOString()
    writeJSON('events.json', [
      {
        id: uuidv4(),
        title: 'Субботник на кирхе Тарау — открытие сезона 2026',
        date: '2026-03-28',
        type: 'subbotnik',
        location: 'пос. Владимирово',
        description: 'Масштабное открытие волонтёрского сезона на легендарной кирхе с сердечком.',
        status: 'past',
        volunteers: 120,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        title: '300-й выезд: субботник в Алленберге',
        date: '2026-08-29',
        type: 'subbotnik',
        location: 'Алленберг',
        description: 'Юбилейный 300-й выезд движения. 140 волонтёров помогали новому собственнику комплекса.',
        status: 'past',
        volunteers: 140,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        title: 'Прогулка по «Готическому кольцу» с Игорем Ляшуком',
        date: '2026-01-24',
        type: 'tour',
        location: 'Готическое кольцо',
        description: 'Большое путешествие по достопримечательностям Готического кольца: Чехово, Домново, Правдинск, городище Ушкуй.',
        status: 'past',
        volunteers: null,
        createdAt: now,
        updatedAt: now,
      },
    ])
  }

  const albums = readJSON('albums.json', null)
  if (albums === null || !Array.isArray(albums) || albums.length === 0) {
    const now = new Date().toISOString()
    writeJSON('albums.json', [
      {
        id: uuidv4(),
        title: 'Кирха Тарау — открытие сезона 2026',
        description: 'Фото с большого субботника',
        cover: null,
        date: '2026-03-28',
        photos: [],
        createdAt: now,
        updatedAt: now,
      },
    ])
  }


  const videos = readJSON('videos.json', null)
  if (videos === null || !Array.isArray(videos)) {
    writeJSON('videos.json', [])
  }
}
seedIfEmpty()

function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Требуется авторизация' })
  }
  try {
    const token = header.slice(7)
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Недействительный токен' })
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${uuidv4()}${ext}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) cb(null, true)
    else cb(new Error('Только изображения (jpeg, png, webp, gif)'))
  },
})

const videoUpload = multer({
  storage,
  limits: { fileSize: 400 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase()
    if (/^video\//.test(file.mimetype) || ['.mp4', '.webm', '.ogg', '.mov', '.m4v'].includes(ext)) {
      cb(null, true)
    } else cb(new Error('Только видео (mp4, webm, mov, ogg)'))
  },
})

function parseEmbed(raw) {
  const trimmed = (raw || '').trim()
  if (!trimmed) return { provider: 'other', embedUrl: null, thumbnail: null, url: '' }
  const fromIframe = trimmed.match(/src=["']([^"']+)["']/i)
  const url = fromIframe ? fromIframe[1] : trimmed

  let m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (m) {
    return {
      provider: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${m[1]}`,
      thumbnail: `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`,
      url,
    }
  }
  m = url.match(/rutube\.ru\/(?:video|play\/embed)\/([a-zA-Z0-9]+)/)
  if (m) return { provider: 'rutube', embedUrl: `https://rutube.ru/play/embed/${m[1]}`, thumbnail: null, url }
  m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (m) return { provider: 'vimeo', embedUrl: `https://player.vimeo.com/video/${m[1]}`, thumbnail: null, url }
  if (/video_ext\.php/.test(url)) return { provider: 'vk', embedUrl: url, thumbnail: null, url }
  m = url.match(/(?:vk\.(?:com|ru)|vkvideo\.ru)\/(?:video|clip)(-?\d+)_(\d+)/)
  if (m) {
    return {
      provider: 'vk',
      embedUrl: `https://vk.com/video_ext.php?oid=${m[1]}&id=${m[2]}&hd=2`,
      thumbnail: null,
      url,
    }
  }
  m = url.match(/dzen\.ru\/(?:video\/watch|embed)\/([a-zA-Z0-9]+)/)
  if (m) return { provider: 'other', embedUrl: `https://dzen.ru/embed/${m[1]}`, thumbnail: null, url }

  if (/\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url)) {
    return { provider: 'direct', embedUrl: null, thumbnail: null, url }
  }
  return { provider: 'other', embedUrl: url, thumbnail: null, url }
}

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email и пароль обязательны' })

  const users = readJSON('users.json')
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Неверный email или пароль' })
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  })
})

app.get('/api/auth/me', auth, (req, res) => {
  res.json({ user: req.user })
})

app.get('/api/news', (req, res) => {
  let items = readJSON('news.json')
  if (req.query.status) items = items.filter((n) => n.status === req.query.status)
  items.sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt))
  res.json(items)
})

app.get('/api/news/:id', (req, res) => {
  const items = readJSON('news.json')
  const item = items.find((n) => n.id === req.params.id)
  if (!item) return res.status(404).json({ error: 'Не найдено' })
  res.json(item)
})

app.post('/api/news', auth, (req, res) => {
  const items = readJSON('news.json')
  const now = new Date().toISOString()
  const item = {
    id: uuidv4(),
    title: req.body.title || 'Без названия',
    slug: req.body.slug || req.body.title?.toLowerCase().replace(/\s+/g, '-').slice(0, 60) || uuidv4(),
    excerpt: req.body.excerpt || '',
    content: req.body.content || '',
    cover: req.body.cover || null,
    status: req.body.status || 'draft',
    publishedAt: req.body.status === 'published' ? now : null,
    createdAt: now,
    updatedAt: now,
  }
  items.unshift(item)
  writeJSON('news.json', items)
  res.status(201).json(item)
})

app.put('/api/news/:id', auth, (req, res) => {
  const items = readJSON('news.json')
  const idx = items.findIndex((n) => n.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Не найдено' })

  const prev = items[idx]
  const updated = {
    ...prev,
    ...req.body,
    id: prev.id,
    createdAt: prev.createdAt,
    updatedAt: new Date().toISOString(),
  }
  if (req.body.status === 'published' && prev.status !== 'published') {
    updated.publishedAt = new Date().toISOString()
  }
  items[idx] = updated
  writeJSON('news.json', items)
  res.json(updated)
})

app.delete('/api/news/:id', auth, (req, res) => {
  let items = readJSON('news.json')
  items = items.filter((n) => n.id !== req.params.id)
  writeJSON('news.json', items)
  res.json({ ok: true })
})

app.get('/api/events', (req, res) => {
  let items = readJSON('events.json')
  if (req.query.status) items = items.filter((e) => e.status === req.query.status)
  items.sort((a, b) => new Date(b.date) - new Date(a.date))
  res.json(items)
})

app.get('/api/events/:id', (req, res) => {
  const items = readJSON('events.json')
  const item = items.find((e) => e.id === req.params.id)
  if (!item) return res.status(404).json({ error: 'Не найдено' })
  res.json(item)
})

app.post('/api/events', auth, (req, res) => {
  const items = readJSON('events.json')
  const now = new Date().toISOString()
  const item = {
    id: uuidv4(),
    title: req.body.title || 'Без названия',
    date: req.body.date || now.slice(0, 10),
    type: req.body.type || 'subbotnik',
    location: req.body.location || '',
    description: req.body.description || '',
    status: req.body.status || 'upcoming',
    volunteers: req.body.volunteers || null,
    createdAt: now,
    updatedAt: now,
  }
  items.unshift(item)
  writeJSON('events.json', items)
  res.status(201).json(item)
})

app.put('/api/events/:id', auth, (req, res) => {
  const items = readJSON('events.json')
  const idx = items.findIndex((e) => e.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Не найдено' })
  items[idx] = { ...items[idx], ...req.body, id: items[idx].id, updatedAt: new Date().toISOString() }
  writeJSON('events.json', items)
  res.json(items[idx])
})

app.delete('/api/events/:id', auth, (req, res) => {
  let items = readJSON('events.json')
  items = items.filter((e) => e.id !== req.params.id)
  writeJSON('events.json', items)
  res.json({ ok: true })
})

app.get('/api/albums', (_req, res) => {
  const items = readJSON('albums.json')
  items.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
  res.json(items)
})

app.get('/api/albums/:id', (req, res) => {
  const items = readJSON('albums.json')
  const item = items.find((a) => a.id === req.params.id)
  if (!item) return res.status(404).json({ error: 'Не найдено' })
  res.json(item)
})

app.post('/api/albums', auth, (req, res) => {
  const items = readJSON('albums.json')
  const now = new Date().toISOString()
  const item = {
    id: uuidv4(),
    title: req.body.title || 'Новый альбом',
    description: req.body.description || '',
    cover: null,
    date: req.body.date || now.slice(0, 10),
    photos: [],
    createdAt: now,
    updatedAt: now,
  }
  items.unshift(item)
  writeJSON('albums.json', items)
  res.status(201).json(item)
})

app.put('/api/albums/:id', auth, (req, res) => {
  const items = readJSON('albums.json')
  const idx = items.findIndex((a) => a.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Не найдено' })
  items[idx] = { ...items[idx], ...req.body, id: items[idx].id, photos: items[idx].photos, updatedAt: new Date().toISOString() }
  writeJSON('albums.json', items)
  res.json(items[idx])
})

app.delete('/api/albums/:id', auth, (req, res) => {
  let items = readJSON('albums.json')
  items = items.filter((a) => a.id !== req.params.id)
  writeJSON('albums.json', items)
  res.json({ ok: true })
})

app.post('/api/albums/:id/photos', auth, upload.array('photos', 30), (req, res) => {
  const items = readJSON('albums.json')
  const idx = items.findIndex((a) => a.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Альбом не найден' })

  const newPhotos = (req.files || []).map((f) => ({
    id: uuidv4(),
    filename: f.filename,
    url: `/uploads/${f.filename}`,
    originalName: f.originalname,
    size: f.size,
    uploadedAt: new Date().toISOString(),
  }))

  items[idx].photos = [...(items[idx].photos || []), ...newPhotos]
  if (!items[idx].cover && newPhotos.length > 0) {
    items[idx].cover = newPhotos[0].url
  }
  items[idx].updatedAt = new Date().toISOString()
  writeJSON('albums.json', items)
  res.status(201).json({ photos: newPhotos, album: items[idx] })
})

app.delete('/api/albums/:albumId/photos/:photoId', auth, (req, res) => {
  const items = readJSON('albums.json')
  const idx = items.findIndex((a) => a.id === req.params.albumId)
  if (idx === -1) return res.status(404).json({ error: 'Альбом не найден' })

  const photo = items[idx].photos.find((p) => p.id === req.params.photoId)
  if (photo) {
    const filePath = path.join(UPLOADS_DIR, photo.filename)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  }
  items[idx].photos = items[idx].photos.filter((p) => p.id !== req.params.photoId)
  items[idx].updatedAt = new Date().toISOString()
  writeJSON('albums.json', items)
  res.json({ ok: true })
})

app.post('/api/upload', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не получен' })
  res.json({
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
  })
})


app.get('/api/videos', (req, res) => {
  let items = readJSON('videos.json')
  if (req.query.status) items = items.filter((v) => v.status === req.query.status)
  if (req.query.category) items = items.filter((v) => v.category === req.query.category)
  items.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
  res.json(items)
})

app.get('/api/videos/:id', (req, res) => {
  const items = readJSON('videos.json')
  const item = items.find((v) => v.id === req.params.id)
  if (!item) return res.status(404).json({ error: 'Не найдено' })
  res.json(item)
})

app.post('/api/videos', auth, (req, res) => {
  const items = readJSON('videos.json')
  const now = new Date().toISOString()
  const parsed = req.body.source === 'embed' ? parseEmbed(req.body.url || '') : {
    provider: 'direct', embedUrl: null, thumbnail: null, url: req.body.url || '',
  }
  const item = {
    id: uuidv4(),
    title: req.body.title || 'Без названия',
    description: req.body.description || '',
    date: req.body.date || now.slice(0, 10),
    category: req.body.category || 'other',
    source: req.body.source || 'embed',
    url: parsed.url || req.body.url || '',
    embedUrl: req.body.embedUrl || parsed.embedUrl,
    provider: req.body.provider || parsed.provider,
    thumbnail: req.body.thumbnail || parsed.thumbnail || null,
    filename: req.body.filename || null,
    status: req.body.status || 'published',
    createdAt: now,
    updatedAt: now,
  }
  items.unshift(item)
  writeJSON('videos.json', items)
  res.status(201).json(item)
})

app.put('/api/videos/:id', auth, (req, res) => {
  const items = readJSON('videos.json')
  const idx = items.findIndex((v) => v.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Не найдено' })
  const prev = items[idx]
  let extra = {}
  if (req.body.source === 'embed' && req.body.url) {
    const parsed = parseEmbed(req.body.url)
    extra = {
      url: parsed.url,
      embedUrl: parsed.embedUrl,
      provider: req.body.provider || parsed.provider,
      thumbnail: req.body.thumbnail || prev.thumbnail || parsed.thumbnail,
    }
  }
  items[idx] = {
    ...prev,
    ...req.body,
    ...extra,
    id: prev.id,
    createdAt: prev.createdAt,
    updatedAt: new Date().toISOString(),
  }
  writeJSON('videos.json', items)
  res.json(items[idx])
})

app.delete('/api/videos/:id', auth, (req, res) => {
  const items = readJSON('videos.json')
  const item = items.find((v) => v.id === req.params.id)
  if (item?.filename) {
    const filePath = path.join(UPLOADS_DIR, item.filename)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  }
  writeJSON('videos.json', items.filter((v) => v.id !== req.params.id))
  res.json({ ok: true })
})

app.post('/api/videos/:id/file', auth, videoUpload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не получен' })
  const items = readJSON('videos.json')
  const idx = items.findIndex((v) => v.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Не найдено' })
  const prev = items[idx]
  if (prev.filename) {
    const old = path.join(UPLOADS_DIR, prev.filename)
    if (fs.existsSync(old)) fs.unlinkSync(old)
  }
  items[idx] = {
    ...prev,
    source: 'upload',
    provider: 'direct',
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`,
    embedUrl: null,
    updatedAt: new Date().toISOString(),
  }
  writeJSON('videos.json', items)
  res.json(items[idx])
})


app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use((err, _req, res, next) => {
  if (err && err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'Файл слишком большой (видео до 400 МБ, фото до 12 МБ)' })
    }
    return res.status(400).json({ error: err.message })
  }
  if (err) return res.status(400).json({ error: err.message || 'Ошибка загрузки' })
  next()
})

const DIST = path.join(__dirname, '..', 'dist')
const hasDist = fs.existsSync(path.join(DIST, 'index.html'))
if (hasDist) {
  app.use(express.static(DIST))
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next()
    res.sendFile(path.join(DIST, 'index.html'))
  })
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\nСайт и API: http://localhost:${PORT}`)
  console.log(`Админка:     http://localhost:${PORT}/admin`)
  if (!hasDist) console.log('Нет dist — для продакшена сначала npm run build')
  console.log('')
})
