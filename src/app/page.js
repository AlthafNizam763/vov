import Topbar from './components/Topbar'
import Header from './components/Header'
import Hero from './components/Hero'
import Campaigns from './components/Campaigns'
import About from './components/About'
import Stats from './components/Stats'
import News from './components/News'
import Testimonials from './components/Testimonials'
import Newsletter from './components/Newsletter'
import Founder from './components/Founder'
import OurTeam from './components/OurTeam'
import Footer from './components/Footer'

export default function Page() {
  return (
    <>
      <Topbar />
      <Header />
      <main>
        <Hero />
        <About />
        <Campaigns />
         <News />
         <Newsletter />
         <Testimonials />
        <Stats />
        <Founder />
        <OurTeam/>
      </main>
      <Footer />
    </>
  )
}
