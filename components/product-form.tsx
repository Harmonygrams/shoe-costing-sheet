"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product } from "@/lib/types"

interface ProductFormProps {
  product?: Product
  onSubmit: (data: { name: string; photo?: string }) => void
  onCancel?: () => void
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name || "")
  const [photo, setPhoto] = useState<string | undefined>(product?.photo || undefined)
  const [uploadError, setUploadError] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSubmit({
      name: name.trim(),
      photo,
    })

    if (!product) {
      // Reset form for new products
      setName("")
      setPhoto(undefined)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Product Image (max 5MB)</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                setUploadError("")
                if (!file) return
                if (file.size > 5 * 1024 * 1024) {
                  setUploadError("File too large. Max 5MB.")
                  e.target.value = ""
                  return
                }
                const reader = new FileReader()
                reader.onload = () => {
                  const result = reader.result as string
                  setPhoto(result)
                }
                reader.onerror = () => setUploadError("Failed to read file")
                reader.readAsDataURL(file)
              }}
            />
            {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
            {photo && (
              <div className="mt-2">
                <img src={photo} alt="Preview" className="w-24 h-24 object-cover rounded-md border" />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button type="submit">{product ? "Update Product" : "Add Product"}</Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
