'use client'

import { useState } from 'react'
import { convertCurrency } from '../lib/api'
import { useEffect } from 'react'
import { FaExchangeAlt } from 'react-icons/fa';

const currencies = [
  { code: 'BRL', name: 'Real Brasileiro' },
  { code: 'USD', name: 'Dólar Americano' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Iene Japonês' },
  { code: 'BGN', name: 'Lev Búlgaro' },
  { code: 'CZK', name: 'Coroa Tcheca' },
  { code: 'DKK', name: 'Coroa Dinamarquesa' },
  { code: 'GBP', name: 'Libra Esterlina' },
  { code: 'HUF', name: 'Florim Húngaro' },
  { code: 'PLN', name: 'Zloti Polonês' },
  { code: 'RON', name: 'Leu Romeno' },
  { code: 'SEK', name: 'Coroa Sueca' },
  { code: 'CHF', name: 'Franco Suíço' },
  { code: 'ISK', name: 'Coroa Islandesa' },
  { code: 'NOK', name: 'Coroa Norueguesa' },
  { code: 'HRK', name: 'Kuna Croata' },
  { code: 'RUB', name: 'Rublo Russo' },
  { code: 'TRY', name: 'Lira Turca' },
  { code: 'AUD', name: 'Dólar Australiano' },
  { code: 'CAD', name: 'Dólar Canadense' },
  { code: 'CNY', name: 'Yuan Chinês' },
  { code: 'HKD', name: 'Dólar de Hong Kong' },
  { code: 'IDR', name: 'Rupia Indonésia' },
  { code: 'ILS', name: 'Shekel Novo Israelense' },
  { code: 'INR', name: 'Rúpia Indiana' },
  { code: 'KRW', name: 'Won Sul-Coreano' },
  { code: 'MXN', name: 'Peso Mexicano' },
  { code: 'MYR', name: 'Ringgit Malaio' },
  { code: 'NZD', name: 'Dólar Neozelandês' },
  { code: 'PHP', name: 'Peso Filipino' },
  { code: 'SGD', name: 'Dólar de Singapura' },
  { code: 'THB', name: 'Baht Tailandês' },
  { code: 'ZAR', name: 'Rand Sul-Africano' },
]

export default function ConverterForm() {
  const [inputAmount, setInputAmount] = useState<number>(0)
  const [fromCurrency, setFromCurrency] = useState('BRL')
  const [toCurrency, setToCurrency] = useState('USD')
  const [amount, setAmount] = useState<number>(0) // Armazena o valor usado na última conversão
  const [displayAmount, setDisplayAmount] = useState(fromCurrency) // valor exibido no input
  const [rate, setRate] = useState<number>(0)
  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [convertedFromCurrency, setConvertedFromCurrency] = useState(fromCurrency)
  const [convertedToCurrency, setConvertedToCurrency] = useState(toCurrency)

  useEffect(() => {
    const formatted = inputAmount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: fromCurrency,
    })
    setDisplayAmount(formatted)

    // Limpa resultados anteriores
    setResult(null)
    setRate(0)
    setConvertedFromCurrency(fromCurrency)
    setConvertedToCurrency(toCurrency)
  }, [fromCurrency])

  async function handleConvert() {
    if (inputAmount <= 0) {
      setError('Digite um valor válido')
      setResult(null)
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await convertCurrency(fromCurrency, toCurrency, inputAmount)
      setResult(data.result)
      setRate(data.rate)
      setConvertedFromCurrency(fromCurrency)
      setConvertedToCurrency(toCurrency)
      setAmount(inputAmount) // Só atualiza `amount` depois da conversão
    } catch {
      setError('Falha ao obter conversão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <div className="flex gap-4 items-end">
        <div className='flex flex-col flex-1'>
          <label htmlFor="amount">Valor</label>
          <input
            type="text"
            id="amount"
            className="h-10 border border-gray-300 rounded px-3 py-2"
            value={displayAmount}
            onChange={e => {
              const raw = e.target.value.replace(/[^\d.,]/g, '').replace(',', '.')
              const parsed = parseFloat(raw)

              // Verifica se o número é grande demais
              const digitsOnly = raw.replace('.', '').replace(/^0+/, '') // remove ponto e zeros à esquerda
              const maxDigits = 15

              setDisplayAmount(e.target.value)

              if (digitsOnly.length > maxDigits) {
                setInputAmount(0)
                setResult(null)
                setError('Muitos dígitos! Tente com um número menor.')
                return
              }

              if (!isNaN(parsed)) {
                setInputAmount(parsed)
                setError(null)

                if (rate > 0) {
                  setResult(parsed * rate)
                  setAmount(parsed)
                  setConvertedFromCurrency(fromCurrency)
                  setConvertedToCurrency(toCurrency)
                }
              } else {
                setInputAmount(0)
                setResult(null)
                setError('Digite um valor válido')
              }
            }}
            onBlur={() => {
              const formatted = inputAmount.toLocaleString('pt-BR', {
                style: 'currency',
                currency: fromCurrency,
              })
              setDisplayAmount(formatted)
            }}
            onFocus={() => {
              if (inputAmount === 0) {
                setDisplayAmount('')
              } else {
                setDisplayAmount(inputAmount.toString())
              }
            }}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="amount">De</label>
          <select
            className="h-10 border border-gray-300 rounded px-3 py-2"
            id='fromCurrency'
            value={fromCurrency}
            onChange={e => setFromCurrency(e.target.value)}
          >
            {currencies.map(c => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button 
            className='bg-blue-600 hover:bg-blue-700 rounded-full p-2 text-white w-10 h-10 flex items-center justify-center cursor-pointer'
            onClick={() => {
              setFromCurrency(toCurrency)
              setToCurrency(fromCurrency)
            }}>
            <FaExchangeAlt />
          </button>
        </div>

        <div className="flex flex-col">
          <label htmlFor="amount">Para</label>
          <select
            className="h-10 border border-gray-300 rounded px-3 py-2"
            id='toCurrency'
            value={toCurrency}
            onChange={e => setToCurrency(e.target.value)}
          >
            {currencies.map(c => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleConvert}
        disabled={loading}
        className="w-40 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'Convertendo...' : 'Converter'}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {result !== null && (
        <div className="mt-6 space-y-2">
          <p className="text-lg font-semibold">
            {amount.toFixed(2)} {convertedFromCurrency} =
          </p>
          <p className="text-xl font-bold">
            {result.toFixed(6)} {convertedToCurrency}
          </p>
          <p>
            1 {convertedFromCurrency} = {rate.toFixed(6)} {convertedToCurrency}
          </p>
          <p>
            1 {convertedToCurrency} = {(1 / rate).toFixed(6)} {convertedFromCurrency}
          </p>
        </div>
      )}
    </div>
  )
}