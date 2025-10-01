"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProductForm } from "@/components/product-form"
import { ProductList } from "@/components/product-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { dataStore } from "@/lib/data-store"
import type { Product } from "@/lib/types"

export default function HomePage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setProducts(dataStore.getProducts())
  }, [])

  const handleAddProduct = (data: { name: string; photo?: string }) => {
    const newProduct = dataStore.addProduct(data)
    setProducts(dataStore.getProducts())
    setShowForm(false)
  }

  const handleEditProduct = (data: { name: string; photo?: string }) => {
    if (!editingProduct) return

    dataStore.updateProduct(editingProduct.id, data)
    setProducts(dataStore.getProducts())
    setEditingProduct(null)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product? This will also delete all associated materials.")) {
      dataStore.deleteProduct(productId)
      setProducts(dataStore.getProducts())
    }
  }

  const handleViewProduct = (product: Product) => {
    router.push(`/product/${product.id}`)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Shoe Costing App</h1>
            <p className="text-muted-foreground">Manage your shoe products and calculate material costs</p>
          </div>

          {!showForm && !editingProduct && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          )}
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

        <ProductList
          products={products}
          onEdit={setEditingProduct}
          onDelete={handleDeleteProduct}
          onView={handleViewProduct}
        />
      </div>
    </div>
  )
}
