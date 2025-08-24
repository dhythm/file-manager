"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Download,
  Grid3X3,
  List,
  Trash2,
  Edit3,
  FileText,
  FileImage,
  File,
  X,
  GripVertical,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  lastModified: Date
  selected: boolean
  preview?: string
}

const sampleFiles: FileItem[] = [
  {
    id: "1",
    name: "photo_001.jpg",
    size: 2048576,
    type: "image/jpeg",
    lastModified: new Date("2024-01-15"),
    selected: false,
    preview: "/beautiful-landscape.png",
  },
  {
    id: "2",
    name: "image_002.png",
    size: 1536000,
    type: "image/png",
    lastModified: new Date("2024-01-14"),
    selected: false,
    preview: "/modern-architecture-photo.png",
  },
  {
    id: "3",
    name: "document.pdf",
    size: 512000,
    type: "application/pdf",
    lastModified: new Date("2024-01-13"),
    selected: false,
  },
  {
    id: "4",
    name: "readme.txt",
    size: 2048,
    type: "text/plain",
    lastModified: new Date("2024-01-12"),
    selected: false,
  },
  {
    id: "5",
    name: "presentation.pptx",
    size: 4096000,
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    lastModified: new Date("2024-01-11"),
    selected: false,
  },
]

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return FileImage
  if (type === "application/pdf") return FileText
  if (type.startsWith("text/")) return FileText
  return File
}

export default function FileManager() {
  const [files, setFiles] = useState<FileItem[]>(sampleFiles)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "date" | "size" | "manual">("name")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [draggedFile, setDraggedFile] = useState<string | null>(null)
  const [renamePattern, setRenamePattern] = useState<"sequential" | "date" | "prefix" | "suffix">("sequential")
  const [renameValue, setRenameValue] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedFiles = files.filter((file) => file.selected)
  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0)

  const handleFileSelect = (fileId: string) => {
    setFiles(files.map((file) => (file.id === fileId ? { ...file, selected: !file.selected } : file)))
  }

  const handleSelectAll = () => {
    const allSelected = files.every((file) => file.selected)
    setFiles(files.map((file) => ({ ...file, selected: !allSelected })))
  }

  const handleDeleteSelected = () => {
    setFiles(files.filter((file) => !file.selected))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || [])
    const newFiles: FileItem[] = uploadedFiles.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified),
      selected: false,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }))
    setFiles([...files, ...newFiles])
  }

  const handleDragStart = (fileId: string) => {
    setDraggedFile(fileId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetFileId: string) => {
    e.preventDefault()
    if (!draggedFile || draggedFile === targetFileId) return

    const draggedIndex = files.findIndex((f) => f.id === draggedFile)
    const targetIndex = files.findIndex((f) => f.id === targetFileId)

    const newFiles = [...files]
    const [draggedItem] = newFiles.splice(draggedIndex, 1)
    newFiles.splice(targetIndex, 0, draggedItem)

    setFiles(newFiles)
    setDraggedFile(null)
  }

  const applyRename = () => {
    const newFiles = files.map((file, index) => {
      if (!file.selected) return file

      let newName = file.name
      const extension = file.name.split(".").pop()
      const baseName = file.name.replace(`.${extension}`, "")

      switch (renamePattern) {
        case "sequential":
          newName = `${renameValue || "file"}_${String(index + 1).padStart(3, "0")}.${extension}`
          break
        case "date":
          const date = new Date().toISOString().split("T")[0]
          newName = `${date}_${baseName}.${extension}`
          break
        case "prefix":
          newName = `${renameValue}${baseName}.${extension}`
          break
        case "suffix":
          newName = `${baseName}${renameValue}.${extension}`
          break
      }

      return { ...file, name: newName }
    })

    setFiles(newFiles)
    setRenameValue("")
  }

  const sortedFiles = [...files].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "date":
        return b.lastModified.getTime() - a.lastModified.getTime()
      case "size":
        return b.size - a.size
      case "manual":
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold">ファイル管理ツール</h1>
          <div className="flex items-center gap-3">
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              ファイルを選択
            </Button>
            <Button
              variant="outline"
              disabled={selectedFiles.length === 0}
              className="disabled:opacity-50 bg-transparent"
            >
              <Download className="mr-2 h-4 w-4" />
              ZIPダウンロード
            </Button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="border-b bg-card px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">名前順</SelectItem>
                <SelectItem value="date">日付順</SelectItem>
                <SelectItem value="size">サイズ順</SelectItem>
                <SelectItem value="manual">手動</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={files.length > 0 && files.every((file) => file.selected)}
                onCheckedChange={handleSelectAll}
              />
              <Label className="text-sm">全て選択</Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              disabled={selectedFiles.length === 0}
            >
              <Edit3 className="mr-2 h-4 w-4" />
              一括リネーム
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
              disabled={selectedFiles.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              選択を削除
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} />

          {files.length === 0 ? (
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center"
              onDrop={(e) => {
                e.preventDefault()
                const droppedFiles = Array.from(e.dataTransfer.files)
                const newFiles: FileItem[] = droppedFiles.map((file, index) => ({
                  id: `dropped-${Date.now()}-${index}`,
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  lastModified: new Date(file.lastModified),
                  selected: false,
                  preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
                }))
                setFiles(newFiles)
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">ここにファイルをドラッグ&ドロップ</p>
              <p className="text-sm text-muted-foreground mt-2">または「ファイルを選択」ボタンをクリック</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {sortedFiles.map((file) => {
                const IconComponent = getFileIcon(file.type)
                return (
                  <Card
                    key={file.id}
                    className={cn(
                      "group cursor-pointer transition-all hover:shadow-md",
                      file.selected && "ring-2 ring-primary",
                      draggedFile === file.id && "opacity-50",
                    )}
                    draggable={sortBy === "manual"}
                    onDragStart={() => handleDragStart(file.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, file.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <Checkbox checked={file.selected} onCheckedChange={() => handleFileSelect(file.id)} />
                        {sortBy === "manual" && <GripVertical className="h-4 w-4 text-muted-foreground" />}
                      </div>

                      <div className="aspect-square mb-3 flex items-center justify-center bg-muted rounded-md overflow-hidden">
                        {file.preview ? (
                          <img
                            src={file.preview || "/placeholder.svg"}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <IconComponent className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-sm font-medium">
                <div className="col-span-1"></div>
                <div className="col-span-1">種類</div>
                <div className="col-span-4">名前</div>
                <div className="col-span-2">サイズ</div>
                <div className="col-span-3">更新日時</div>
                <div className="col-span-1">操作</div>
              </div>
              {sortedFiles.map((file) => {
                const IconComponent = getFileIcon(file.type)
                return (
                  <div
                    key={file.id}
                    className={cn(
                      "grid grid-cols-12 gap-4 p-3 border-t hover:bg-muted/50 transition-colors",
                      file.selected && "bg-primary/10",
                      draggedFile === file.id && "opacity-50",
                    )}
                    draggable={sortBy === "manual"}
                    onDragStart={() => handleDragStart(file.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, file.id)}
                  >
                    <div className="col-span-1 flex items-center">
                      <Checkbox checked={file.selected} onCheckedChange={() => handleFileSelect(file.id)} />
                    </div>
                    <div className="col-span-1 flex items-center">
                      {file.preview ? (
                        <img
                          src={file.preview || "/placeholder.svg"}
                          alt={file.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      ) : (
                        <IconComponent className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="col-span-4 flex items-center">
                      <span className="truncate" title={file.name}>
                        {file.name}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                      {formatFileSize(file.size)}
                    </div>
                    <div className="col-span-3 flex items-center text-sm text-muted-foreground">
                      {file.lastModified.toLocaleDateString("ja-JP")}
                    </div>
                    <div className="col-span-1 flex items-center">
                      {sortBy === "manual" && <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>

        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-80 border-l bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">リネーム設定</h2>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">リネームパターン</Label>
                <Select value={renamePattern} onValueChange={(value: any) => setRenamePattern(value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sequential">連番</SelectItem>
                    <SelectItem value="date">日付追加</SelectItem>
                    <SelectItem value="prefix">プレフィックス</SelectItem>
                    <SelectItem value="suffix">サフィックス</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {renamePattern !== "date" && (
                <div>
                  <Label className="text-sm font-medium">
                    {renamePattern === "sequential"
                      ? "ベース名"
                      : renamePattern === "prefix"
                        ? "プレフィックス"
                        : "サフィックス"}
                  </Label>
                  <Input
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    placeholder={renamePattern === "sequential" ? "file" : "追加テキスト"}
                    className="mt-2"
                  />
                </div>
              )}

              <div>
                <Label className="text-sm font-medium mb-2 block">プレビュー</Label>
                <div className="bg-muted p-3 rounded-md text-sm">
                  {selectedFiles.slice(0, 3).map((file, index) => {
                    const extension = file.name.split(".").pop()
                    const baseName = file.name.replace(`.${extension}`, "")
                    let preview = file.name

                    switch (renamePattern) {
                      case "sequential":
                        preview = `${renameValue || "file"}_${String(index + 1).padStart(3, "0")}.${extension}`
                        break
                      case "date":
                        const date = new Date().toISOString().split("T")[0]
                        preview = `${date}_${baseName}.${extension}`
                        break
                      case "prefix":
                        preview = `${renameValue}${baseName}.${extension}`
                        break
                      case "suffix":
                        preview = `${baseName}${renameValue}.${extension}`
                        break
                    }

                    return (
                      <div key={file.id} className="truncate">
                        {file.name} → {preview}
                      </div>
                    )
                  })}
                  {selectedFiles.length > 3 && (
                    <div className="text-muted-foreground">...他 {selectedFiles.length - 3} ファイル</div>
                  )}
                </div>
              </div>

              <Button onClick={applyRename} className="w-full">
                適用
              </Button>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="text-lg font-semibold mb-4">ファイル情報</h3>
              {selectedFiles.length === 1 ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">ファイル名</Label>
                    <p className="text-sm font-medium">{selectedFiles[0].name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">サイズ</Label>
                    <p className="text-sm font-medium">{formatFileSize(selectedFiles[0].size)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">種類</Label>
                    <p className="text-sm font-medium">{selectedFiles[0].type}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">更新日時</Label>
                    <p className="text-sm font-medium">{selectedFiles[0].lastModified.toLocaleString("ja-JP")}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {selectedFiles.length === 0
                    ? "ファイルを選択してください"
                    : `${selectedFiles.length}個のファイルを選択中`}
                </p>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t bg-card px-6 py-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            {selectedFiles.length > 0 && (
              <>
                <Badge variant="secondary">{selectedFiles.length}個のファイルを選択中</Badge>
                <span>合計サイズ: {formatFileSize(totalSize)}</span>
              </>
            )}
          </div>
          <span>全{files.length}ファイル</span>
        </div>
      </footer>
    </div>
  )
}
