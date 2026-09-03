import { Routes, Route, Outlet } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Objects from './pages/Objects'
import ObjectDetail from './pages/ObjectDetail'
import Events from './pages/Events'
import Goals from './pages/Goals'
import Archive from './pages/Archive'
import AlbumDetail from './pages/AlbumDetail'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import { AuthProvider } from './admin/AuthContext'
import AdminLayout from './admin/AdminLayout'
import Login from './admin/Login'
import Dashboard from './admin/Dashboard'
import NewsAdmin from './admin/NewsAdmin'
import EventsAdmin from './admin/EventsAdmin'
import AlbumsAdmin from './admin/AlbumsAdmin'

function PublicLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/objects" element={<Objects />} />
          <Route path="/objects/:id" element={<ObjectDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/archive/:id" element={<AlbumDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="news" element={<NewsAdmin />} />
          <Route path="events" element={<EventsAdmin />} />
          <Route path="albums" element={<AlbumsAdmin />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
