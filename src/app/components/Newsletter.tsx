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
    <section className="bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 px-6 sm:px-8 py-8 sm:py-10 text-center md:text-left">
          
          {/* Text Section */}
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Newsletter
            </h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Bring together people who care about a cause
            </p>
          </div>

          {/* Form Section */}
          {submitted ? (
            <p className="text-[#4EBC73] font-medium w-full md:w-auto">
              Thank you for subscribing!
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3 mt-4 md:mt-0"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                required
                className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4EBC73] transition"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#4EBC73] hover:bg-green-600 text-white font-medium px-6 py-2 rounded-lg transition"
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
