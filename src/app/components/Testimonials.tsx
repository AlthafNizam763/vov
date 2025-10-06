export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        {/* Left Image */}
        <div className="relative flex justify-center">
          {/* <div className="absolute left-0 top-50 bottom-0 w-6 bg-[#4EBC73] rounded-l-2xl hidden md:block"></div> */}
          <img
            src="/images/Testimonial.jpeg" // replace with your image
            alt="Testimonial"
            className="rounded-2xl object-cover relative z-10 w-[260px] h-[471px]"
          />
          {/* <div className="absolute right-0 top-50 bottom-0 w-6 bg-[#4EBC73] rounded-r-2xl hidden md:block"></div> */}
        </div>

        {/* Right Content */}
        <div>
          <p className="text-sm text-[#58A3DC] font-semibold mb-2">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What People Say about <br />
            <span className="text-[#58A3DC]">Our Organization</span>
          </h2>
          <p className="text-gray-600 italic mb-8 leading-relaxed">
            “Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Felis pellentesque cras interdum ornare feugiat eget feugiat. 
            Nunc, urna vitae pellentesque risus, ut volutpat eget libero vel. 
            Vitae urna pharetra sem consectetur sed mi, nisl id feugiat. 
            At egestas praesent mauris metus risus accumsan. Cras gravida 
            natoque maecenas risus ultricies. Sed tincidunt porttitor 
            viverra nunc neque, enim. Tristique molestie turpis turpis diam.”
          </p>
          <div>
            <p className="font-bold text-gray-800">Kay Henderson</p>
            <p className="text-gray-500 text-sm">Businessman – Entrepreneur</p>
          </div>
        </div>
      </div>
    </section>
  )
}
