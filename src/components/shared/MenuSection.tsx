'use client';

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { MenuType } from '@prisma/client'
import { FaPhone } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  type: MenuType
  isActive: boolean
  isFeatured: boolean
  allergens?: string[]
  image?: string
}

export default function MenuSection() {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await fetch(`/api/menu?type=RAVINTOLA&featured=true`)
        if (!response.ok) throw new Error('Korostettujen tuotteiden haku epäonnistui')
        const data = await response.json()
        setItems(data)
      } catch (error) {
        console.error('Korostettujen tuotteiden hakuvirhe:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedItems()
  }, [])

  if (loading) return <div>Ladataan...</div>

  if (items.length === 0) {
    return null
  }

  const formatDescription = (description: string) => {
    return description.split(',').map(item => item.trim());
  };

  const handleCall = () => {
    window.location.href = `tel:${process.env.NEXT_PUBLIC_PHONE}`;
  };

  return (
    <section className="py-8 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100/20 dark:border-white/10 max-w-sm mx-auto w-full cursor-pointer"
              onClick={() => router.push('/ravintola/ruokat')}
            >
              <div className="relative h-44 sm:h-48 w-full overflow-hidden">
                <Image
                  src={item.image || '/images/placeholder.jpg'}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-5">
                <h3 className="text-xl lg:text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                  {item.name}
                </h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Sisältö:</h4>
                  <ul className="space-y-1">
                    {formatDescription(item.description).map((desc, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-400 text-sm pl-3 border-l-2 border-amber-200 dark:border-amber-700">
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>

                {item.allergens && item.allergens.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Allergeenit:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {item.allergens.map((allergen, index) => (
                        <span key={index} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-xl lg:text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {item.price} €
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCall();
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white rounded-xl shadow-lg hover:shadow-amber-500/20 dark:hover:shadow-amber-400/20 transform hover:translate-x-1 transition-all duration-300 text-sm flex items-center gap-2"
                  >
                    <FaPhone className="w-3 h-3" />
                    Tilaa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 