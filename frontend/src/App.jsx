import { useEffect, useState } from 'react'

function App() {
  const [categories, setCategories] = useState([])
  const [articles, setArticles] = useState([])
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState('home') // 'home' | 'login' | 'register' | 'newArticle'
  const [currentUser, setCurrentUser] = useState(null)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', department: '' })
  const [articleForm, setArticleForm] = useState({ title: '', slug: '', content: '', category_id: '', status: 'draft' })
  const [authError, setAuthError] = useState('')
  const [articleError, setArticleError] = useState('')

  const loadData = () => {
    fetch('http://127.0.0.1:8000/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))

    fetch('http://127.0.0.1:8000/articles')
      .then((res) => res.json())
      .then((data) => setArticles(data))
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleLogin = (e) => {
    e.preventDefault()
    setAuthError('')
    fetch('http://127.0.0.1:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Invalid email or password')
        return res.json()
      })
      .then((data) => {
        setCurrentUser(data)
        setView('home')
      })
      .catch((err) => setAuthError(err.message))
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setAuthError('')
    fetch('http://127.0.0.1:8000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerForm),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Could not create account')
        return res.json()
      })
      .then((data) => {
        setCurrentUser(data)
        setView('home')
      })
      .catch((err) => setAuthError(err.message))
  }

  const handleCreateArticle = (e) => {
    e.preventDefault()
    setArticleError('')
    fetch('http://127.0.0.1:8000/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...articleForm,
        category_id: articleForm.category_id ? parseInt(articleForm.category_id) : null,
        author_id: currentUser ? currentUser.id : null,
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Could not create article')
        return res.json()
      })
      .then(() => {
        setArticleForm({ title: '', slug: '', content: '', category_id: '', status: 'draft' })
        loadData()
        setView('home')
      })
      .catch((err) => setArticleError(err.message))
  }

  const NavBar = () => (
    <div className="flex justify-end gap-4 px-6 py-3 bg-blue-700 text-sm text-blue-100">
      {currentUser ? (
        <>
          <span>Hi, {currentUser.name} ({currentUser.role})</span>
          <button onClick={() => setView('newArticle')} className="hover:text-white">+ New Article</button>
          <button onClick={() => setCurrentUser(null)} className="hover:text-white">Log out</button>
        </>
      ) : (
        <>
          <button onClick={() => setView('login')} className="hover:text-white">Login</button>
          <button onClick={() => setView('register')} className="hover:text-white">Register</button>
        </>
      )}
    </div>
  )

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <div className="max-w-sm mx-auto mt-16 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-slate-800">Log In</h2>
          {authError && <p className="text-red-600 text-sm mb-3">{authError}</p>}
          <form onSubmit={handleLogin} className="space-y-3">
            <input type="email" placeholder="Email" className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
            <input type="password" placeholder="Password" className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
            <button type="submit" className="w-full bg-blue-600 text-white rounded py-2">Log In</button>
          </form>
          <button onClick={() => setView('home')} className="mt-4 text-sm text-blue-600">← Back</button>
        </div>
      </div>
    )
  }

  if (view === 'register') {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <div className="max-w-sm mx-auto mt-16 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-slate-800">Register</h2>
          {authError && <p className="text-red-600 text-sm mb-3">{authError}</p>}
          <form onSubmit={handleRegister} className="space-y-3">
            <input type="text" placeholder="Full Name" className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} />
            <input type="email" placeholder="Email" className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} />
            <input type="password" placeholder="Password" className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} />
            <input type="text" placeholder="Department" className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800" value={registerForm.department} onChange={(e) => setRegisterForm({ ...registerForm, department: e.target.value })} />
            <button type="submit" className="w-full bg-blue-600 text-white rounded py-2">Register</button>
          </form>
          <button onClick={() => setView('home')} className="mt-4 text-sm text-blue-600">← Back</button>
        </div>
      </div>
    )
  }

  if (view === 'newArticle') {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <div className="max-w-xl mx-auto mt-10 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-slate-800">New Article</h2>
          {articleError && <p className="text-red-600 text-sm mb-3">{articleError}</p>}
          <form onSubmit={handleCreateArticle} className="space-y-3">
            <input type="text" placeholder="Title" className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800" value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })} />
            <input type="text" placeholder="Slug (e.g. how-to-x)" className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800" value={articleForm.slug} onChange={(e) => setArticleForm({ ...articleForm, slug: e.target.value })} />
            <textarea placeholder="Content" rows="5" className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800" value={articleForm.content} onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })} />
            <select className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800" value={articleForm.category_id} onChange={(e) => setArticleForm({ ...articleForm, category_id: e.target.value })}>
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800" value={articleForm.status} onChange={(e) => setArticleForm({ ...articleForm, status: e.target.value })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <button type="submit" className="w-full bg-blue-600 text-white rounded py-2">Create Article</button>
          </form>
          <button onClick={() => setView('home')} className="mt-4 text-sm text-blue-600">← Back</button>
        </div>
      </div>
    )
  }

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <header className="bg-blue-600 text-white py-6 px-6">
          <button onClick={() => setSelectedArticle(null)} className="text-blue-100 hover:text-white mb-4">← Back to Knowledge Base</button>
          <h1 className="text-2xl font-bold">{selectedArticle.title}</h1>
        </header>
        <main className="max-w-3xl mx-auto px-6 py-10">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-slate-700 leading-relaxed">{selectedArticle.content}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <header className="bg-blue-600 text-white py-10 px-6 text-center">
        <h1 className="text-3xl font-bold mb-2">PulseDesk-KB</h1>
        <p className="text-blue-100 mb-6">Healthcare Knowledge Base & Support Assistant</p>
        <input type="text" placeholder="Search articles..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-md mx-auto block rounded-lg px-4 py-2 text-slate-800 border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-lg shadow p-4 text-center">
                <p className="font-medium text-slate-700">{cat.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Articles</h2>
          <div className="space-y-4">
            {filteredArticles.length === 0 && <p className="text-slate-500">No articles match your search.</p>}
            {filteredArticles.map((article) => (
              <div key={article.id} onClick={() => setSelectedArticle(article)} className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition">
                <h3 className="font-semibold text-slate-800">{article.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{article.status}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App