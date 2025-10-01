// Currency formatting utility for Mauritius Rupees
export function formatCurrency(amount: number): string {
  return `Rs ${amount.toFixed(2)}`
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1000000) {
    return `Rs ${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `Rs ${(amount / 1000).toFixed(1)}K`
  }
  return `Rs ${amount.toFixed(2)}`
}

// Currency symbol and code constants
export const CURRENCY_SYMBOL = "Rs"
export const CURRENCY_CODE = "MUR"
export const CURRENCY_NAME = "Mauritius Rupees"
