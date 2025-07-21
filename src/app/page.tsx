'use client'
import ConverterForm from '@/components/ConverterForm'

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gray-100 flex items-center justify-center p-4 text-lg text-slate-800 gap-15">
      <h1 className='text-4xl font-semibold'>Conversor de Moedas</h1>
      <ConverterForm />
    </main>
  )
}