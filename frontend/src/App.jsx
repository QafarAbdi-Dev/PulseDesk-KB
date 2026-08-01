import { useEffect, useState } from 'react'

function App() {
  const [categories, setCategories] = useState([])
  const [articles, setArticles] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))

    fetch('http://127.0.0.1:8000/articles')
      .then((res) => res.json())
      .then((data) => setArticles(data))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-blue-600 text-white py-10 px-6 text-center">
        <h1 className="text-3xl font-bold mb-2">PulseDesk-KB</h1>
        <p className="text-blue-100">Healthcare Knowledge Base & Support Assistant</p>
        <input
          type="text"
          placeholder="Search articles..."
          className="mt-6 w-full max-w-md mx-auto block rounded-lg px-4 py-2 text-slate-800"
        />
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
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow p-4">
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