import type { Product, Material } from "./types"

class ApiClient {
  private baseUrl = "/api"

  // Product methods
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${this.baseUrl}/products`)
    if (!response.ok) throw new Error("Failed to fetch products")
    return response.json()
  }

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/products/${id}`)
    if (!response.ok) throw new Error("Failed to fetch product")
    return response.json()
  }

  async createProduct(data: { name: string; photo?: string }): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create product")
    return response.json()
  }

  async updateProduct(id: string, data: { name: string; photo?: string }): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update product")
    return response.json()
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
    return response.json()
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
    return response.json()
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
    return response.json()
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
