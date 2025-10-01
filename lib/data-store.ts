import type { Product, Material } from "./types"

// Simple in-memory data store for MVP
class DataStore {
  private products: Product[] = []
  private materials: Material[] = []

  // Product methods
  getProducts(): Product[] {
    return this.products
  }

  getProduct(id: string): Product | undefined {
    return this.products.find((p) => p.id === id)
  }

  addProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.products.push(newProduct)
    return newProduct
  }

  updateProduct(id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Product | null {
    const index = this.products.findIndex((p) => p.id === id)
    if (index === -1) return null

    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date(),
    }
    return this.products[index]
  }

  deleteProduct(id: string): boolean {
    const index = this.products.findIndex((p) => p.id === id)
    if (index === -1) return false

    this.products.splice(index, 1)
    // Also delete associated materials
    this.materials = this.materials.filter((m) => m.productId !== id)
    return true
  }

  // Material methods
  getMaterials(productId: string): Material[] {
    return this.materials.filter((m) => m.productId === productId)
  }

  getMaterial(id: string): Material | undefined {
    return this.materials.find((m) => m.id === id)
  }

  addMaterial(material: Omit<Material, "id" | "createdAt" | "updatedAt">): Material {
    const newMaterial: Material = {
      ...material,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.materials.push(newMaterial)
    return newMaterial
  }

  updateMaterial(id: string, updates: Partial<Omit<Material, "id" | "createdAt">>): Material | null {
    const index = this.materials.findIndex((m) => m.id === id)
    if (index === -1) return null

    this.materials[index] = {
      ...this.materials[index],
      ...updates,
      updatedAt: new Date(),
    }
    return this.materials[index]
  }

  deleteMaterial(id: string): boolean {
    const index = this.materials.findIndex((m) => m.id === id)
    if (index === -1) return false

    this.materials.splice(index, 1)
    return true
  }

  // Costing calculations
  calculateProductCost(productId: string): number {
    const materials = this.getMaterials(productId)
    return materials.reduce((total, material) => {
      return total + material.quantity * material.unitCost
    }, 0)
  }
}

// Export singleton instance
export const dataStore = new DataStore()
