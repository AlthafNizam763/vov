'use client'
import { useState } from 'react'
import { MdOutlineMarkEmailRead } from 'react-icons/md'

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
    <section className="bg-canvas py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div
          className="relative overflow-hidden rounded-[2rem] px-6 sm:px-12 py-12 shadow-xl"
          style={{ background: 'var(--gradient-deep)' }}
        >
          {/* Decorative blobs */}
          <span className="blob blob-accent w-72 h-72 -top-20 -right-16 opacity-40" />
          <span className="blob blob-brand w-64 h-64 -bottom-20 -left-16 opacity-40" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            {/* Text Section */}
            <div className="md:max-w-md">
              <span className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase text-white/90">
                <MdOutlineMarkEmailRead className="text-accent-300 text-base" />
                Stay Connected
              </span>
              <h2 className="font-display text-2xl sm:text-[2rem] font-bold text-white mt-4 leading-tight">
                Join Our Newsletter
              </h2>
              <p className="text-white/70 mt-2 text-sm sm:text-base">
                Bring together people who care about a cause. No spam — just impact.
              </p>
            </div>

            {/* Form Section */}
            {submitted ? (
              <div className="glass-dark rounded-2xl px-6 py-5 text-white font-medium flex items-center gap-3">
                <MdOutlineMarkEmailRead className="text-2xl text-accent-300" />
                Thank you for subscribing!
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full sm:w-72 px-5 py-3.5 rounded-full bg-white/15 border border-white/25 text-white placeholder-white/60 focus:bg-white/25 focus:outline-none focus:ring-2 focus:ring-accent-300 transition backdrop-blur-md"
                />
                <button type="submit" className="btn btn-primary w-full sm:w-auto">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
