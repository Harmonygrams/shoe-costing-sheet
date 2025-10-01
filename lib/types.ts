export interface Product {
  id: string
  name: string
  photo?: string
  createdAt: Date
  updatedAt: Date
}

export interface Material {
  id: string
  productId: string
  category: string
  name: string
  unit: string
  quantity: number
  unitCost: number
  createdAt: Date
  updatedAt: Date
}

export interface CostingBreakdown {
  materials: Material[]
  totalCost: number
  costPerPair: number
}

export type MaterialCategory =
  | "Upper Materials"
  | "Sole Materials"
  | "Hardware"
  | "Lining"
  | "Adhesives"
  | "Packaging"
  | "Other"

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  "Upper Materials",
  "Sole Materials",
  "Hardware",
  "Lining",
  "Adhesives",
  "Packaging",
  "Other",
]

export const COMMON_UNITS = [
  "pieces",
  "pairs",
  "meters",
  "cm",
  "grams",
  "kg",
  "ml",
  "liters",
  "gallon",
  "yards",
  "feet",
]
