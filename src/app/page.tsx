import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in">
          Tervetuloa
        </h1>
        <p className="text-lg md:text-xl mb-12 opacity-80">
          Valitse minne haluat mennä
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
          <Link href="/ravintola" 
                className="group relative overflow-hidden rounded-lg bg-white/10 p-6 md:p-8 transition-all hover:bg-white/20">
            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Ravintola</h2>
              <p className="text-sm md:text-base text-gray-300">
                Vieraile ravintolassamme ja koe ainutlaatuisia makuja ja unohtumattomia ruokailuelämyksiä.
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-20" />
          </Link>

          <Link href="/baari"
                className="group relative overflow-hidden rounded-lg bg-white/10 p-6 md:p-8 transition-all hover:bg-white/20">
            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Baari</h2>
              <p className="text-sm md:text-base text-gray-300">
                Nauti erikoisdrinkeistämme ja viihtyisästä tunnelmasta baarissamme.
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 opacity-0 transition-opacity group-hover:opacity-20" />
          </Link>
        </div>

        <div className="mt-16">
          <Link href="/admin" 
                className="text-sm text-gray-400 hover:text-white transition-colors">
            Hallintapaneeli
          </Link>
        </div>
      </div>
    </main>
  )
}
