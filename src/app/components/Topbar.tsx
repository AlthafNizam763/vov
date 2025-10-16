import { FaWhatsapp, FaInstagram, FaFacebookF} from 'react-icons/fa'
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";

export default function TopBar() {
  return (
    <div className="bg-[#58A3DC] text-white text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center py-2 gap-2">
        {/* Contact info */}
        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 gap-1 sm:gap-0">
          <span className="flex items-center gap-1">
            <IoCall className="text-base" />
            <span>+91 8075873624</span>
          </span>
          <span className="flex items-center gap-1">
            <MdEmail className="text-base" />
            <span>info.voiceofthevoiceless1@gmail.com</span>
          </span>
        </div>

        {/* Social icons */}
        <div className="flex space-x-4 mt-1 sm:mt-0">
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
          <FaFacebookF />
        </a>
      </div>

          </div>
      </div>
        )
      }
