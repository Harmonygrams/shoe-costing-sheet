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
  totalCost: number
  createdAt: Date
  updatedAt: Date
}

export interface CostingBreakdown {
  materials: Material[]
  totalCost: number
  costPerPair: number
}

export type MaterialCategory =
  | "Upper Making"
  | "Sole Materials"
  | "Hardware"
  | "Lining"
  | "Adhesives"
  | "Packaging"
  | "Leather"
  | "Eyelets"
  | "Thread"
  | "Chemical sheet"
  | "Insole"
  | "Insock"
  | "Glue" 
  | "Lace" 
  | "Shoe lasting"  
  | "Shoe Finishing"
  | "Shoe box"
  | "Shoe box"
  | "Other"
  

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  "Upper Making",
  "Sole Materials",
  "Hardware",
  "Lining",
  "Adhesives",
  "Packaging",
  "Leather",
  "Eyelets",
  "Thread",
  "Chemical sheet",
  "Insole",
  "Insock",
  "Glue",
  "Lace",
  "Shoe lasting",
  "Shoe Finishing",
  "Shoe box",
  "Other",
]

export const COMMON_UNITS = [
  "sqft",
  "gallon",
  "pairs",
  "meters",
  "pieces",
  "cm",
  "grams",
  "kg",
  "ml",
  "liters",
  "yards",
  "feet",
  "sqm",
]
