import { useState, FormEvent } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Loader2 } from 'lucide-react'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@ruin-keepers.ru')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/admin" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err: any) {
      setError(err.message || 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-full items-center justify-center text-ruin-gold font-serif text-xl mb-4">
            <img src="../../src/images/images.png" alt="logo" />
          </div>
          <h1 className="font-serif text-2xl text-stone-100">Вход в админку</h1>
          <p className="text-sm text-stone-500 mt-1">Хранители руин</p>
        </div>

        <form onSubmit={handleSubmit} className="card-ruin rounded-2xl p-6 space-y-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-950/40 border border-red-900/50 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs text-stone-500 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-1.5">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-ruin-gold/50"
              required
              placeholder="admin123"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-ruin-gold text-stone-950 font-medium rounded-lg py-2.5 text-sm hover:bg-[#d4b57a] transition disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Войти
          </button>
        </form>
        <p className="text-center text-xs text-stone-600 mt-4">
          По умолчанию: admin@ruin-keepers.ru / admin123
        </p>
      </div>
    </div>
  )
}
