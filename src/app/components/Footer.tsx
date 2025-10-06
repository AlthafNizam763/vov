import Link from "next/link"
import Image from "next/image"
import { FaTwitter, FaInstagram, FaFacebook, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"
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
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
            <Link href="/LoginPage" aria-label="Support">
              <FcSupport />
            </Link>
          </div>
        </div>

        {/* Menu */}
        <div>
          <h4 className="text-base font-semibold mb-4">Menu</h4>
          <ul className="space-y-2 text-sm">
            {["Donations", "Features", "Categories", "Volunteer", "About us"].map((item) => (
              <li key={item}>
                <Link href="#" className="hover:text-[#4EBC73] transition-colors">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* About Us */}
        <div>
          <h4 className="text-base font-semibold mb-4">About us</h4>
          <ul className="space-y-2 text-sm">
            {["How it work?", "Contact us", "FAQ", "Help"].map((item) => (
              <li key={item}>
                <Link href="#" className="hover:text-[#4EBC73] transition-colors">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-base font-semibold mb-4">Contact Info</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-3">
              <FaPhoneAlt className="text-[#4EBC73]" />
              <span>+1-206-156 2849</span>
            </li>
            <li className="flex items-center space-x-3">
              <FaEnvelope className="text-[#4EBC73]" />
              <span>Info.voiceofthevoiceless1@gmail.com</span>
            </li>
            <li className="flex items-center space-x-3">
              <FaMapMarkerAlt className="text-[#4EBC73]" />
              <span>Your Address here</span>
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
