"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { MaterialForm } from "@/components/material-form"
import { MaterialList } from "@/components/material-list"
import { CostingSheet } from "@/components/costing-sheet"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus } from "lucide-react"
import { dataStore } from "@/lib/data-store"
import type { Product, Material } from "@/lib/types"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const foundProduct = dataStore.getProduct(productId)
    if (!foundProduct) {
      router.push("/")
      return
    }

    setProduct(foundProduct)
    setMaterials(dataStore.getMaterials(productId))
  }, [productId, router])

  const handleAddMaterial = (data: {
    category: string
    name: string
    unit: string
    quantity: number
    unitCost: number
  }) => {
    dataStore.addMaterial({ ...data, productId })
    setMaterials(dataStore.getMaterials(productId))
    setShowForm(false)
  }

  const handleEditMaterial = (data: {
    category: string
    name: string
    unit: string
    quantity: number
    unitCost: number
  }) => {
    if (!editingMaterial) return

    dataStore.updateMaterial(editingMaterial.id, data)
    setMaterials(dataStore.getMaterials(productId))
    setEditingMaterial(null)
  }

  const handleDeleteMaterial = (materialId: string) => {
    if (confirm("Are you sure you want to delete this material?")) {
      dataStore.deleteMaterial(materialId)
      setMaterials(dataStore.getMaterials(productId))
    }
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/")} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground">Manage materials and calculate costs</p>
            </div>
          </div>

          {!showForm && !editingMaterial && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Material
            </Button>
          )}
        </div>

        {(showForm || editingMaterial) && (
          <MaterialForm
            productId={productId}
            material={editingMaterial || undefined}
            onSubmit={editingMaterial ? handleEditMaterial : handleAddMaterial}
            onCancel={() => {
              setShowForm(false)
              setEditingMaterial(null)
            }}
          />
        )}

        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="materials">Materials Management</TabsTrigger>
            <TabsTrigger value="costing">Costing Sheet</TabsTrigger>
          </TabsList>
          <TabsContent value="materials" className="space-y-6">
            <MaterialList materials={materials} onEdit={setEditingMaterial} onDelete={handleDeleteMaterial} />
          </TabsContent>
          <TabsContent value="costing" className="space-y-6">
            <CostingSheet product={product} materials={materials} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
