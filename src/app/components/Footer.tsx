import Link from "next/link"
import Image from "next/image"
import { FaWhatsapp, FaInstagram, FaFacebookF, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"

const SOCIALS = [
  { href: "https://wa.me/7034426975", label: "WhatsApp", Icon: FaWhatsapp },
  { href: "https://www.instagram.com/voice__of_the__voiceless?igsh=c2pxbjI5YnpmY3dm", label: "Instagram", Icon: FaInstagram },
  { href: "https://www.facebook.com/share/19wxCiJRJK/?mibextid=wwXIfr", label: "Facebook", Icon: FaFacebookF },
]

const LINKS = [
  { href: "https://www.instagram.com/voice__of_the__voiceless?igsh=c2pxbjI5YnpmY3dm", label: "Instagram" },
  { href: "https://wa.me/7034426975", label: "WhatsApp" },
  { href: "https://www.facebook.com/share/19wxCiJRJK/?mibextid=wwXIfr", label: "Facebook" },
  { href: "https://althafnizam763.github.io/-Personal-Portfolio/", label: "Supporter" },
]

export default function Footer() {
  return (
    <footer className="relative text-slate-300 overflow-hidden" style={{ background: "var(--gradient-deep)" }}>
      {/* top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-brand-500 via-accent-400 to-brand-500" />
      <span className="blob blob-brand w-96 h-96 -top-20 right-10 opacity-20" />

      {/* Top Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        {/* Logo + Tagline */}
        <div>
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/95 shadow-sm overflow-hidden">
              <Image
                src="/images/vov-logo.png"
                alt="Voice of the Voiceless Logo"
                width={32}
                height={32}
                className="object-contain h-7 w-auto"
              />
            </span>
            <span className="font-display text-lg font-bold text-white">
              Voice of the Voiceless
            </span>
          </Link>
          <p className="text-sm text-slate-400 mb-5 leading-relaxed">
            Whatever it is that you care about, there will be a charity working
            on it. Charities help in lots of different ways.
          </p>
          {/* Social Icons */}
          <div className="flex gap-3">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="grid place-items-center w-10 h-10 rounded-full glass-dark text-white hover:scale-110 hover:text-accent-300 transition-all"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Offline Centers */}
        <div>
          <h4 className="font-display text-base font-semibold mb-5 text-white">Offline Centers</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                href="https://www.google.com/maps?q=Voice+of+the+Voiceless,+TC+53/1542,+Vattavila,+Vellayani,+Nemom+(PO),+Thiruvananthapuram,+Kerala+695020"
                target="_blank"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-accent-300 transition-colors"
              >
                <FaMapMarkerAlt className="text-accent-400" />
                Trivandrum
              </Link>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-display text-base font-semibold mb-5 text-white">Links</h4>
          <ul className="space-y-3 text-sm">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-accent-300 transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-display text-base font-semibold mb-5 text-white">Contact Info</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <span className="grid place-items-center w-9 h-9 rounded-lg glass-dark text-accent-300 shrink-0">
                <FaPhoneAlt className="text-xs" />
              </span>
              <span className="text-slate-300">+91 8075873624</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid place-items-center w-9 h-9 rounded-lg glass-dark text-accent-300 shrink-0">
                <FaEnvelope className="text-xs" />
              </span>
              <span className="text-slate-300 break-all">Info.voiceofthevoiceless1@gmail.com</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="grid place-items-center w-9 h-9 rounded-lg glass-dark text-accent-300 shrink-0">
                <FaMapMarkerAlt className="text-xs" />
              </span>
              <span className="text-slate-300 leading-relaxed">
                TC 53/1542, Vattavila, Vellayani, Nemom (PO),
                Thiruvananthapuram, Kerala – 695020
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-400">
          <span>Voice of the Voiceless © {new Date().getFullYear()}. All Rights Reserved.</span>
          <span className="flex items-center gap-1.5">
            Made with <span className="text-accent-400">♥</span> for a better world
          </span>
        </div>
      </div>
    </footer>
  )
}
