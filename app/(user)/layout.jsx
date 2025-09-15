import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/nav/Footer'
export default function UserLayout({ children }) {
  return (
    <>
      <Navbar/>
      <main>{children}</main>
      <Footer />
    </>
  )
}