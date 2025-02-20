import ReservationForm from '@/components/shared/ReservationForm'
import Footer from '@/components/Footer'
import HeaderMenu from '@/components/HeaderMenu'

export default function VarausPage() {
  return (
    <div className="min-h-screen bg-theme">
      {/* Header */}
      <HeaderMenu type="RAVINTOLA" />

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/40 to-black/30 dark:from-white-600/80 dark:via-white-900/30 dark:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-black to-transparent" />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-6xl font-bold mb-6 text-white drop-shadow-lg">Pöytävaraus</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white drop-shadow-md">
            Varaa pöytä ravintolasta tai baarista
          </p>
        </div>
      </section>

      {/* Reservation Form */}
      <section className="py-20 -mt-20 relative z-10 bg-theme">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b dark:from-purple-900/20 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-theme">Tee varaus</h2>
            <div className="bg-theme border border-theme p-8 rounded-lg">
              <ReservationForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
} 