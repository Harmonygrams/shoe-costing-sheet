import type { Product, Material } from "./types"

class ApiClient {
  private baseUrl = "/api"

  // Product methods
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${this.baseUrl}/products`)
    if (!response.ok) throw new Error("Failed to fetch products")
    const raw = await response.json()
    return raw.map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(p.createdAt),
    }))
  }

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/products/${id}`)
    if (!response.ok) throw new Error("Failed to fetch product")
    const p = await response.json()
    return { ...p, createdAt: new Date(p.createdAt), updatedAt: new Date(p.updatedAt ?? p.createdAt) }
  }

  async createProduct(data: { name: string; photo?: string }): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create product")
    const p = await response.json()
    return { ...p, createdAt: new Date(p.createdAt), updatedAt: new Date(p.updatedAt ?? p.createdAt) }
  }

  async updateProduct(id: string, data: { name: string; photo?: string }): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update product")
    const p = await response.json()
    return { ...p, createdAt: new Date(p.createdAt), updatedAt: new Date(p.updatedAt ?? p.createdAt) }
  }

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/products/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete product")
  }

  // Material methods
  async getMaterials(productId: string): Promise<Material[]> {
    const response = await fetch(`${this.baseUrl}/products/${productId}/materials`)
    if (!response.ok) throw new Error("Failed to fetch materials")
    const raw = await response.json()
    return raw.map((m: any) => ({
      ...m,
      createdAt: new Date(m.createdAt),
      updatedAt: new Date(m.updatedAt ?? m.createdAt),
    }))
  }

  async createMaterial(
    productId: string,
    data: {
      category: string
      name: string
      unit: string
      quantity: number
      unitCost: number
    },
  ): Promise<Material> {
    const response = await fetch(`${this.baseUrl}/products/${productId}/materials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create material")
    const m = await response.json()
    return { ...m, createdAt: new Date(m.createdAt), updatedAt: new Date(m.updatedAt ?? m.createdAt) }
  }

  async updateMaterial(
    id: string,
    data: {
      category: string
      name: string
      unit: string
      quantity: number
      unitCost: number
    },
  ): Promise<Material> {
    const response = await fetch(`${this.baseUrl}/materials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update material")
    const m = await response.json()
    return { ...m, createdAt: new Date(m.createdAt), updatedAt: new Date(m.updatedAt ?? m.createdAt) }
  }

  async deleteMaterial(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/materials/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete material")
  }

  // Costing methods
  async getCosting(productId: string) {
    const response = await fetch(`${this.baseUrl}/products/${productId}/costing`)
    if (!response.ok) throw new Error("Failed to fetch costing")
    return response.json()
  }
}

export const apiClient = new ApiClient()
