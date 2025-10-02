"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { MaterialForm } from "@/components/material-form"
import { MaterialList } from "@/components/material-list"
import { CostingSheet } from "@/components/costing-sheet"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import type { Product, Material } from "@/lib/types"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [materialSearch, setMaterialSearch] = useState("")

  useEffect(() => {
    setLoading(true)
    ;(async () => {
      try {
        const p = await apiClient.getProduct(productId)
        setProduct(p)
        const mats = await apiClient.getMaterials(productId)
        setMaterials(mats)
      } catch (e) {
        console.error("Failed to load product or materials", e)
        router.push("/")
      } finally {
        setLoading(false)
      }
    })()
  }, [productId, router])

  const handleAddMaterial = async (data: {
    category: string
    name: string
    unit: string
    quantity: number
    unitCost: number
  }) => {
    try {
      await apiClient.createMaterial(productId, data)
      const mats = await apiClient.getMaterials(productId)
      setMaterials(mats)
      setShowForm(false)
    } catch (e) {
      console.error("Failed to add material", e)
    }
  }

  const handleEditMaterial = async (data: {
    category: string
    name: string
    unit: string
    quantity: number
    unitCost: number
  }) => {
    if (!editingMaterial) return
    try {
      await apiClient.updateMaterial(editingMaterial.id, data)
      const mats = await apiClient.getMaterials(productId)
      setMaterials(mats)
      setEditingMaterial(null)
    } catch (e) {
      console.error("Failed to update material", e)
    }
  }

  const handleDeleteMaterial = async (materialId: string) => {
    if (confirm("Are you sure you want to delete this material?")) {
      try {
        await apiClient.deleteMaterial(materialId)
        const mats = await apiClient.getMaterials(productId)
        setMaterials(mats)
      } catch (e) {
        console.error("Failed to delete material", e)
      }
    }
  }

  if (loading || !product) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="h-10 w-64 bg-muted animate-pulse rounded-md" />
          <div className="grid grid-cols-1 gap-4">
            <div className="h-24 w-full bg-muted animate-pulse rounded-md" />
            <div className="h-48 w-full bg-muted animate-pulse rounded-md" />
            <div className="h-64 w-full bg-muted animate-pulse rounded-md" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
            <div className="flex items-center justify-between">
              <div className="flex-1" />
              <input
                value={materialSearch}
                onChange={(e) => setMaterialSearch(e.target.value)}
                placeholder="Search materials..."
                className="border rounded-md px-3 py-2 text-sm w-64"
              />
            </div>
            <MaterialList
              materials={materials.filter((m) => m.name.toLowerCase().includes(materialSearch.toLowerCase()))}
              onEdit={setEditingMaterial}
              onDelete={handleDeleteMaterial}
            />
          </TabsContent>
          <TabsContent value="costing" className="space-y-6">
            <CostingSheet product={product} materials={materials} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
