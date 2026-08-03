import { useEffect, useState } from 'react'

const CATEGORY_ICONS = {
  'getting-started': '🚀',
  'patient-management': '🏥',
  'clinical-modules': '🩺',
  'billing-finance': '💳',
  'system-administration': '⚙️',
  'compliance-security': '🔒',
  'troubleshooting': '🛠️',
  'release-notes': '📋',
}

function ChatWidget({ chatOpen, setChatOpen, chatMessages, chatInput, setChatInput, handleChatSend, onViewArticle }) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {chatOpen && (
        <div className="mb-3 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-slate-200">
          <div className="bg-slate-800 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold text-sm">PulseDesk Assistant</span>
            <button onClick={() => setChatOpen(false)} className="text-slate-300 hover:text-white">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50">
            {chatMessages.map((msg, i) => (
              <div key={i} className={msg.from === 'user' ? 'text-right' : 'text-left'}>
                <div
                  className={`inline-block px-3 py-2 rounded-lg text-sm max-w-[85%] ${
                    msg.from === 'user' ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-800'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sourceArticle && (
                  <button
                    onClick={() => onViewArticle(msg.sourceArticle)}
                    className="block text-xs text-blue-700 mt-1 hover:underline"
                  >
                    View full article →
                  </button>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSend} className="border-t border-slate-200 p-2 flex gap-2 bg-white">
            <input
              type="text"
              placeholder="Ask a question..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 border border-slate-300 rounded px-2 py-1 text-sm text-slate-800"
            />
            <button type="submit" className="bg-slate-800 text-white rounded px-3 py-1 text-sm">Send</button>
          </form>
        </div>
      )}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="bg-slate-800 hover:bg-slate-900 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center text-2xl"
      >
        💬
      </button>
    </div>
  )
}

function TopBar({ currentUser, setView, setCurrentUser, searchTerm, setSearchTerm }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
        <button onClick={() => setView('home')} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center text-white font-bold text-sm">P</div>
          <span className="font-semibold text-slate-800">PulseDesk-KB</span>
        </button>

        <div className="flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Search articles, SOPs, troubleshooting guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
        </div>

        <div className="flex items-center gap-3 text-sm">
          {currentUser ? (
            <>
              <span className="text-slate-500">{currentUser.name} · <span className="uppercase text-xs text-blue-700 font-medium">{currentUser.role}</span></span>
              {(currentUser.role === 'editor' || currentUser.role === 'admin') && (
                <button onClick={() => setView('newArticle')} className="bg-blue-700 hover:bg-blue-800 text-white rounded-md px-3 py-1.5 text-sm font-medium">
                  + New Article
                </button>
              )}
              {currentUser.role === 'admin' && (
                <button onClick={() => setView('drafts')} className="text-slate-600 hover:text-slate-900">
                  Review Drafts
                </button>
              )}
              <button onClick={() => setCurrentUser(null)} className="text-slate-500 hover:text-slate-800">Log out</button>
            </>
          ) : (
            <>
              <button onClick={() => setView('login')} className="text-slate-600 hover:text-slate-900">Login</button>
              <button onClick={() => setView('register')} className="bg-blue-700 hover:bg-blue-800 text-white rounded-md px-3 py-1.5 text-sm font-medium">
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function Sidebar({ categories, articles, activeCategory, setActiveCategory }) {
  const countFor = (catId) => articles.filter((a) => a.category_id === catId).length

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white min-h-[calc(100vh-57px)] py-6 px-3 hidden md:block">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 mb-2">Categories</p>
      <button
        onClick={() => setActiveCategory(null)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm mb-1 ${
          activeCategory === null ? 'bg-blue-50 text-blue-800 font-medium' : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        <span>📚 All Articles</span>
        <span className="text-xs text-slate-400">{articles.length}</span>
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.id)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm mb-1 ${
            activeCategory === cat.id ? 'bg-blue-50 text-blue-800 font-medium' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>{CATEGORY_ICONS[cat.slug] || '📁'} {cat.name}</span>
          <span className="text-xs text-slate-400">{countFor(cat.id)}</span>
        </button>
      ))}
    </aside>
  )
}

function App() {
  const [categories, setCategories] = useState([])
  const [articles, setArticles] = useState([])
  const [draftArticles, setDraftArticles] = useState([])
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [view, setView] = useState('home')
  const [currentUser, setCurrentUser] = useState(null)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', department: '' })
  const [articleForm, setArticleForm] = useState({ title: '', slug: '', content: '', category_id: '', status: 'draft' })
  const [authError, setAuthError] = useState('')
  const [articleError, setArticleError] = useState('')

  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: 'Hi! Ask me a question about the knowledge base.' },
  ])

  const loadData = () => {
    fetch('http://127.0.0.1:8000/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))

    fetch('http://127.0.0.1:8000/articles')
      .then((res) => res.json())
      .then((data) => setArticles(data))
  }

  const loadDrafts = (adminId) => {
    fetch(`http://127.0.0.1:8000/articles/drafts?admin_id=${adminId}`)
      .then((res) => res.json())
      .then((data) => setDraftArticles(data))
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredArticles = articles
    .filter((a) => a.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((a) => (activeCategory ? a.category_id === activeCategory : true))

  const featuredArticles = articles.slice(0, 3)

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

    const isEditor = currentUser && currentUser.role === 'editor'

    fetch('http://127.0.0.1:8000/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...articleForm,
        status: isEditor ? 'draft' : articleForm.status,
        category_id: articleForm.category_id ? parseInt(articleForm.category_id) : null,
        author_id: currentUser ? currentUser.id : null,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.detail || 'Could not create article')
        }
        return res.json()
      })
      .then(() => {
        setArticleForm({ title: '', slug: '', content: '', category_id: '', status: 'draft' })
        loadData()
        setView('home')
      })
      .catch((err) => setArticleError(err.message))
  }

  const handlePublish = (articleId) => {
    fetch(`http://127.0.0.1:8000/articles/${articleId}/publish?admin_id=${currentUser.id}`, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then(() => {
        loadDrafts(currentUser.id)
        loadData()
      })
  }

  const handleChatSend = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    const question = chatInput.trim()
    setChatMessages((prev) => [...prev, { from: 'user', text: question }])
    setChatInput('')

    const match = articles.find((a) =>
      a.title.toLowerCase().includes(question.toLowerCase()) ||
      question.toLowerCase().split(' ').some((word) => word.length > 3 && a.title.toLowerCase().includes(word))
    )

    setTimeout(() => {
      if (match) {
        setChatMessages((prev) => [
          ...prev,
          { from: 'bot', text: `Here's what I found in "${match.title}": ${match.content}`, sourceArticle: match },
        ])
      } else {
        setChatMessages((prev) => [
          ...prev,
          { from: 'bot', text: "I couldn't find a relevant article for that. Try rephrasing, or browse a category on the left." },
        ])
      }
    }, 400)
  }

  const handleViewArticleFromChat = (article) => {
    setSelectedArticle(article)
    setChatOpen(false)
  }

  const chatProps = { chatOpen, setChatOpen, chatMessages, chatInput, setChatInput, handleChatSend, onViewArticle: handleViewArticleFromChat }
  const topBarProps = { currentUser, setView, setCurrentUser, searchTerm, setSearchTerm }
  const sidebarProps = { categories, articles, activeCategory, setActiveCategory }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopBar {...topBarProps} />
        <div className="max-w-sm mx-auto mt-16 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Log In</h2>
          {authError && <p className="text-red-600 text-sm mb-3">{authError}</p>}
          <form onSubmit={handleLogin} className="space-y-3">
            <input type="email" placeholder="Email" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
            <input type="password" placeholder="Password" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
            <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-md py-2 text-sm font-medium">Log In</button>
          </form>
          <button onClick={() => setView('home')} className="mt-4 text-sm text-blue-700">← Back</button>
        </div>
        <ChatWidget {...chatProps} />
      </div>
    )
  }

  if (view === 'register') {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopBar {...topBarProps} />
        <div className="max-w-sm mx-auto mt-16 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Register</h2>
          {authError && <p className="text-red-600 text-sm mb-3">{authError}</p>}
          <form onSubmit={handleRegister} className="space-y-3">
            <input type="text" placeholder="Full Name" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} />
            <input type="email" placeholder="Email" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} />
            <input type="password" placeholder="Password" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} />
            <input type="text" placeholder="Department" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800" value={registerForm.department} onChange={(e) => setRegisterForm({ ...registerForm, department: e.target.value })} />
            <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-md py-2 text-sm font-medium">Register</button>
          </form>
          <button onClick={() => setView('home')} className="mt-4 text-sm text-blue-700">← Back</button>
        </div>
        <ChatWidget {...chatProps} />
      </div>
    )
  }

  if (view === 'newArticle') {
    const isEditor = currentUser && currentUser.role === 'editor'
    return (
      <div className="min-h-screen bg-slate-50">
        <TopBar {...topBarProps} />
        <div className="max-w-xl mx-auto mt-10 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">New Article</h2>
          {isEditor && (
            <p className="text-amber-600 text-xs mb-3 bg-amber-50 border border-amber-200 rounded px-3 py-2">
              As an Editor, your articles are saved as drafts and require Admin approval before publishing.
            </p>
          )}
          {articleError && <p className="text-red-600 text-sm mb-3">{articleError}</p>}
          <form onSubmit={handleCreateArticle} className="space-y-3">
            <input type="text" placeholder="Title" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800" value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })} />
            <input type="text" placeholder="Slug (e.g. how-to-x)" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800" value={articleForm.slug} onChange={(e) => setArticleForm({ ...articleForm, slug: e.target.value })} />
            <textarea placeholder="Content" rows="5" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800" value={articleForm.content} onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })} />
            <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800" value={articleForm.category_id} onChange={(e) => setArticleForm({ ...articleForm, category_id: e.target.value })}>
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {!isEditor && (
              <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800" value={articleForm.status} onChange={(e) => setArticleForm({ ...articleForm, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            )}
            <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-md py-2 text-sm font-medium">
              {isEditor ? 'Submit as Draft' : 'Create Article'}
            </button>
          </form>
          <button onClick={() => setView('home')} className="mt-4 text-sm text-blue-700">← Back</button>
        </div>
        <ChatWidget {...chatProps} />
      </div>
    )
  }

  if (view === 'drafts') {
    if (!currentUser || currentUser.role !== 'admin') {
      return (
        <div className="min-h-screen bg-slate-50">
          <TopBar {...topBarProps} />
          <p className="text-center text-slate-500 mt-16">Access denied.</p>
        </div>
      )
    }
    if (draftArticles.length === 0 && draftArticles !== null) {
      loadDrafts(currentUser.id)
    }
    return (
      <div className="min-h-screen bg-slate-50">
        <TopBar {...topBarProps} />
        <div className="max-w-3xl mx-auto mt-10 px-6">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Pending Drafts</h2>
          {draftArticles.length === 0 && <p className="text-slate-500 text-sm">No drafts awaiting review.</p>}
          <div className="space-y-3">
            {draftArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
                <h3 className="font-medium text-slate-800">{article.title}</h3>
                <p className="text-slate-500 text-sm mt-1 mb-3">{article.content.slice(0, 120)}...</p>
                <button
                  onClick={() => handlePublish(article.id)}
                  className="bg-blue-700 hover:bg-blue-800 text-white rounded-md px-3 py-1.5 text-sm font-medium"
                >
                  Publish
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => setView('home')} className="mt-6 text-sm text-blue-700">← Back</button>
        </div>
        <ChatWidget {...chatProps} />
      </div>
    )
  }

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopBar {...topBarProps} />
        <div className="flex">
          <Sidebar {...sidebarProps} setActiveCategory={(id) => { setActiveCategory(id); setSelectedArticle(null) }} />
          <main className="flex-1 max-w-3xl mx-auto px-6 py-10">
            <button onClick={() => setSelectedArticle(null)} className="text-blue-700 hover:underline text-sm mb-4 inline-block">← Back to Knowledge Base</button>
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">{selectedArticle.status}</p>
              <h1 className="text-2xl font-bold text-slate-900 mb-4">{selectedArticle.title}</h1>
              <p className="text-slate-700 leading-relaxed">{selectedArticle.content}</p>
            </div>
          </main>
        </div>
        <ChatWidget {...chatProps} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar {...topBarProps} />

      {!searchTerm && !activeCategory && (
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
          <div className="max-w-5xl mx-auto px-6 py-10">
            <h1 className="text-2xl font-bold mb-1">Welcome to PulseDesk Knowledge Base</h1>
            <p className="text-blue-100 text-sm mb-6">Search documentation, SOPs, and troubleshooting guides for HMIS and related healthcare products.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{articles.length}</p>
                <p className="text-xs text-blue-100">Articles</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{categories.length}</p>
                <p className="text-xs text-blue-100">Categories</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">98%</p>
                <p className="text-xs text-blue-100">Satisfaction</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-xs text-blue-100">Assistant Access</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        <Sidebar {...sidebarProps} />
        <main className="flex-1 max-w-4xl mx-auto px-6 py-8">
          {!searchTerm && !activeCategory && featuredArticles.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Featured Articles</h2>
              <div className="grid md:grid-cols-3 gap-3">
                {featuredArticles.map((article) => {
                  const cat = categories.find((c) => c.id === article.category_id)
                  return (
                    <div
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition"
                    >
                      <span className="text-xl">{cat ? CATEGORY_ICONS[cat.slug] : '📄'}</span>
                      <h3 className="font-medium text-slate-800 text-sm mt-2 leading-snug">{article.title}</h3>
                      <p className="text-slate-400 text-xs mt-2">{cat ? cat.name : 'Uncategorized'}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <h1 className="text-xl font-semibold text-slate-800 mb-1">
            {activeCategory ? categories.find((c) => c.id === activeCategory)?.name : 'All Articles'}
          </h1>
          <p className="text-sm text-slate-500 mb-6">{filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}</p>

          <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100 shadow-sm">
            {filteredArticles.length === 0 && (
              <p className="text-slate-500 text-sm p-6">No articles match your search.</p>
            )}
            {filteredArticles.map((article) => {
              const cat = categories.find((c) => c.id === article.category_id)
              return (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="px-5 py-4 cursor-pointer hover:bg-slate-50 transition flex items-center gap-3"
                >
                  <span className="text-lg">{cat ? CATEGORY_ICONS[cat.slug] : '📄'}</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800 text-sm">{article.title}</h3>
                    <p className="text-slate-400 text-xs mt-0.5">{cat ? cat.name : 'Uncategorized'} · {article.status}</p>
                  </div>
                  <span className="text-slate-300 text-sm">→</span>
                </div>
              )
            })}
          </div>
        </main>
      </div>
      <ChatWidget {...chatProps} />
    </div>
  )
}

export default App