"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProductForm } from "@/components/product-form"
import { ProductList } from "@/components/product-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import type { Product } from "@/lib/types"

export default function HomePage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setLoading(true)
    apiClient
      .getProducts()
      .then(setProducts)
      .catch((e) => console.error("Failed to load products", e))
      .finally(() => setLoading(false))
  }, [])

  const handleAddProduct = async (data: { name: string; photo?: string }) => {
    try {
      await apiClient.createProduct(data)
      const fresh = await apiClient.getProducts()
      setProducts(fresh)
      setShowForm(false)
    } catch (e) {
      console.error("Failed to create product", e)
    }
  }

  const handleEditProduct = async (data: { name: string; photo?: string }) => {
    if (!editingProduct) return
    try {
      await apiClient.updateProduct(editingProduct.id, data)
      const fresh = await apiClient.getProducts()
      setProducts(fresh)
      setEditingProduct(null)
    } catch (e) {
      console.error("Failed to update product", e)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product? This will also delete all associated materials.")) {
      try {
        await apiClient.deleteProduct(productId)
        const fresh = await apiClient.getProducts()
        setProducts(fresh)
      } catch (e) {
        console.error("Failed to delete product", e)
      }
    }
  }

  const handleViewProduct = (product: Product) => {
    router.push(`/product/${product.id}`)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Shoe Costing App</h1>
            <p className="text-muted-foreground">Manage your shoe products and calculate material costs</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="border rounded-md px-3 py-2 text-sm w-full md:w-56"
            />
            {!showForm && !editingProduct && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            )}
          </div>
        </div>

        {(showForm || editingProduct) && (
          <ProductForm
            product={editingProduct || undefined}
            onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
            onCancel={() => {
              setShowForm(false)
              setEditingProduct(null)
            }}
          />
        )}

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="h-24 w-full bg-muted animate-pulse rounded-md" />
              <div className="h-24 w-full bg-muted animate-pulse rounded-md" />
              <div className="h-24 w-full bg-muted animate-pulse rounded-md" />
            </div>
          </div>
        ) : (
          <ProductList
            products={products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))}
            onEdit={setEditingProduct}
            onDelete={handleDeleteProduct}
            onView={handleViewProduct}
          />
        )}
      </div>
    </div>
  )
}
