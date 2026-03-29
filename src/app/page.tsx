import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import SocialProof from '@/components/landing/SocialProof'
import Features from '@/components/landing/Features'
import Waitlist from '@/components/landing/Waitlist'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <Waitlist />
      <Footer />
    </main>
  )
}
