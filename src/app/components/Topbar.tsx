import { FaTwitter, FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa'
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
            <span className="hidden xs:inline">+1-206-156 2849</span>
          </span>
          <span className="flex items-center gap-1">
            <MdEmail className="text-base" />
            <span className="hidden xs:inline">info.voiceofthevoiceless1@gmail.com</span>
          </span>
        </div>

        {/* Social icons */}
        <div className="flex space-x-4 mt-1 sm:mt-0">
          <a href="#" aria-label="Twitter" className="hover:text-gray-200"><FaTwitter /></a>
          <a href="#" aria-label="Instagram" className="hover:text-gray-200"><FaInstagram /></a>
          <a href="#" aria-label="Facebook" className="hover:text-gray-200"><FaFacebookF /></a>
          <a href="#" aria-label="YouTube" className="hover:text-gray-200"><FaYoutube /></a>
        </div>
      </div>
    </div>
  )
}
