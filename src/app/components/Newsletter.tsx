'use client'
import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    // integrate with newsletter service here
    setSubmitted(true)
  }

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Newsletter</h2>
            <p className="text-gray-500 mt-1">
              Bring together people who care about a cause
            </p>
          </div>

          {submitted ? (
            <p className="text-[#4EBC73] font-medium">
              Thank you for subscribing!
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex w-full md:w-auto items-center gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                required
                className="flex-1 md:w-64 px-4 py-2 rounded border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="submit"
                className="bg-[#4EBC73] hover:bg-green-600 text-white font-medium px-6 py-2 rounded transition"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
