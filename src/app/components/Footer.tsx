import Link from "next/link"
import Image from "next/image"
import { FaWhatsapp, FaInstagram, FaFacebook, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"
import { FcSupport } from "react-icons/fc";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        
        {/* Logo + Tagline */}
        <div>
          <div className="flex items-center mb-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/vov-logo.png"
                alt="Voice of the Voiceless Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-lg font-semibold">Voice of the voiceless</span>
            </Link>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Whatever it is that you care about, there will be a charity working on it. Charities help in lots of different ways.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4 text-[#4EBC73] text-lg">
          <a
           href="https://wa.me/7034426975"
           aria-label="WhatsApp"
           target="_blank"
           rel="noopener noreferrer"
           className="hover:text-gray-200"
            >
           <FaWhatsapp />
           </a>
           <a
           href="https://www.instagram.com/voice__of_the__voiceless?igsh=c2pxbjI5YnpmY3dm"
           aria-label="Instagram"
           target="_blank"
           rel="noopener noreferrer"
           className="hover:text-gray-200"
           >
            <FaInstagram />
          </a>
          <a
            href="https://www.facebook.com/share/19wxCiJRJK/?mibextid=wwXIfr"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200"
          >
            <FaFacebook />
          </a>
            <Link href="/LoginPage" aria-label="Support">
              <FcSupport />
            </Link>
          </div>
        </div>

        {/* Offline Centers */}
        <div>
          <h4 className="text-base font-semibold mb-4">Offline Centers</h4>
          <ul className="space-y-2 text-sm">
            {["Trivandrum"].map((item) => (
              <li key={item}>
                <Link href="https://www.google.com/maps?q=Voice+of+the+Voiceless,+TC+53/1542,+Vattavila,+Vellayani,+Nemom+(PO),+Thiruvananthapuram,+Kerala+695020"
                target="_blank"
                className="hover:text-[#4EBC73] transition-colors">{item}</Link>
              </li>
            ))}
          </ul>
        </div>


        {/* Links */}
        <div>
        <h4 className="text-base font-semibold mb-4">Links</h4>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href="https://www.instagram.com/voice__of_the__voiceless?igsh=c2pxbjI5YnpmY3dm"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#4EBC73] transition-colors"
            >
              Instagram
            </Link>
          </li>
          <li>
            <Link
              href="https://wa.me/7034426975"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#4EBC73] transition-colors"
            >
              WhatsApp
            </Link>
          </li>
          <li>
            <Link
              href="https://www.facebook.com/share/19wxCiJRJK/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#4EBC73] transition-colors"
            >
              Facebook
            </Link>
          </li>
          <li>
            <Link
              href="https://althafnizam763.github.io/-Personal-Portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#4EBC73] transition-colors"
            >
             Support
            </Link>
          </li>
        </ul>
      </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-base font-semibold mb-4">Contact Info</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-3">
              <FaPhoneAlt className="text-[#4EBC73]" />
              <span>+91 8075873624</span>
            </li>
            <li className="flex items-center space-x-3">
              <FaEnvelope className="text-[#4EBC73]" />
              <span>Info.voiceofthevoiceless1@gmail.com</span>
            </li>
            <li className="flex items-start space-x-3">
            <FaMapMarkerAlt className="text-[#4EBC73] text-3xl mt-1" />
            <span>
              Voice of the Voiceless, TC 53/1542, Vattavila, Vellayani, Nemom (PO),
              Thiruvananthapuram, Kerala – 695020
            </span>
          </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#58A3DC] text-white text-center py-3 text-sm">
        Voice of the voiceless © {new Date().getFullYear()}. All Rights Reserved.
      </div>
    </footer>
  )
}
