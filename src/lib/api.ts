export const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''

console.log('API URL:', apiUrl)


export async function convertCurrency(from: string, to: string, amount: number) {
  const res = await fetch(`${apiUrl}/converter?from=${from}&to=${to}&amount=${amount}`)
  if (!res.ok) throw new Error('Erro na conversão')
  return await res.json()
}