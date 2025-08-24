'use client'

import {
  ArrowDown,
  ArrowUp,
  Download,
  Edit3,
  File,
  FileImage,
  FileText,
  Grid3X3,
  GripVertical,
  List,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import type React from 'react'
import { useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

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
    id: '1',
    name: 'photo_001.jpg',
    size: 2048576,
    type: 'image/jpeg',
    lastModified: new Date('2024-01-15'),
    selected: false,
    preview: '/beautiful-landscape.png',
  },
  {
    id: '2',
    name: 'image_002.png',
    size: 1536000,
    type: 'image/png',
    lastModified: new Date('2024-01-14'),
    selected: false,
    preview: '/modern-architecture-photo.png',
  },
  {
    id: '3',
    name: 'document.pdf',
    size: 512000,
    type: 'application/pdf',
    lastModified: new Date('2024-01-13'),
    selected: false,
  },
  {
    id: '4',
    name: 'readme.txt',
    size: 2048,
    type: 'text/plain',
    lastModified: new Date('2024-01-12'),
    selected: false,
  },
  {
    id: '5',
    name: 'presentation.pptx',
    size: 4096000,
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    lastModified: new Date('2024-01-11'),
    selected: false,
  },
]

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

const formatDateTime = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return FileImage
  if (type === 'application/pdf') return FileText
  if (type.startsWith('text/')) return FileText
  return File
}

import JSZip from 'jszip'

const generateMockFileContent = async (file: FileItem): Promise<Blob> => {
  if (file.type.startsWith('image/')) {
    // 実際の画像ファイルが存在する場合は、それを使用
    if (file.preview) {
      try {
        const response = await fetch(file.preview)
        if (response.ok) {
          return await response.blob()
        }
      } catch (_error) {}
    }

    // フォールバック: Canvas で簡易画像を生成
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 200
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(0, 0, 200, 200)
      ctx.fillStyle = '#333'
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(file.name, 100, 100)
    }
    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob || new Blob())
      }, file.type)
    })
  }

  if (file.type === 'text/plain') {
    return new Blob(
      [
        `Sample content for ${file.name}\n\nThis is a mock file generated for demonstration purposes.\nOriginal size: ${file.size} bytes\nLast modified: ${file.lastModified.toISOString()}`,
      ],
      { type: 'text/plain' }
    )
  }

  if (file.type === 'application/pdf') {
    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT
/F1 12 Tf
100 700 Td
(${file.name}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
trailer
<< /Size 5 /Root 1 0 R >>
startxref
365
%%EOF`
    return new Blob([pdfContent], { type: 'application/pdf' })
  }

  return new Blob(
    [
      `File: ${file.name}\nSize: ${file.size} bytes\nType: ${file.type}\nLast Modified: ${file.lastModified.toISOString()}\n\nThis is a mock file content.`,
    ],
    { type: 'text/plain' }
  )
}

const handleZipDownload = async (files: FileItem[]): Promise<void> => {
  try {
    const selectedFiles = files.filter((file) => file.selected)

    if (selectedFiles.length === 0) {
      alert('ダウンロードするファイルを選択してください。')
      return
    }

    const zip = new JSZip()

    for (const file of selectedFiles) {
      const content = await generateMockFileContent(file)
      zip.file(file.name, content)
    }

    const blob = await zip.generateAsync({ type: 'blob' })

    const timestamp = new Date()
      .toISOString()
      .replace(/[:\-T]/g, '')
      .slice(0, 14)
    const fileName = `files_${timestamp}.zip`

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => URL.revokeObjectURL(url), 100)
  } catch (_error) {
    alert('ZIPファイルの生成に失敗しました。')
  }
}

export default function FileManager() {
  const [files, setFiles] = useState<FileItem[]>(sampleFiles)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'manual'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [draggedFile, setDraggedFile] = useState<string | null>(null)
  
  // リネーム設定の状態管理
  const [renamePattern, setRenamePattern] = useState<'sequential' | 'date' | 'prefix' | 'suffix'>('sequential')
  const [digitCount, setDigitCount] = useState(3)
  const [separator, setSeparator] = useState('_')
  const [renameValue, setRenameValue] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedFiles = files.filter((file) => file.selected)
  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0)

  const handleFileSelect = (fileId: string) => {
    setFiles(
      files.map((file) => (file.id === fileId ? { ...file, selected: !file.selected } : file))
    )
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
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
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
    let sequentialCounter = 1
    const newFiles = files.map((file) => {
      if (!file.selected) return file

      const extension = file.name.split('.').pop()
      const baseName = file.name.replace(`.${extension}`, '')
      
      let newName = ''
      
      switch (renamePattern) {
        case 'sequential':
          // 連番のみ（プレフィックスなし）
          newName = `${String(sequentialCounter).padStart(digitCount, '0')}.${extension}`
          sequentialCounter++
          break
        case 'date': {
          // 日付 + 区切り文字 + 連番
          const date = new Date().toISOString().split('T')[0]
          newName = `${date}${separator}${String(sequentialCounter).padStart(digitCount, '0')}.${extension}`
          sequentialCounter++
          break
        }
        case 'prefix':
          // プレフィックス + 区切り文字 + 連番
          newName = `${renameValue || 'prefix'}${separator}${String(sequentialCounter).padStart(digitCount, '0')}.${extension}`
          sequentialCounter++
          break
        case 'suffix':
          // 連番 + 区切り文字 + サフィックス
          newName = `${String(sequentialCounter).padStart(digitCount, '0')}${separator}${renameValue || 'suffix'}.${extension}`
          sequentialCounter++
          break
      }

      return { ...file, name: newName }
    })

    setFiles(newFiles)
    setRenameValue('')
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const sortedFiles = [...files].sort((a, b) => {
    let result = 0

    switch (sortBy) {
      case 'name':
        result = a.name.localeCompare(b.name)
        break
      case 'date':
        result = a.lastModified.getTime() - b.lastModified.getTime()
        break
      case 'size':
        result = a.size - b.size
        break
      case 'manual':
        return 0
    }

    return sortOrder === 'asc' ? result : -result
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
              ファイルをアップロード
            </Button>
            <Button
              variant="outline"
              disabled={selectedFiles.length === 0}
              className="disabled:opacity-50 bg-transparent"
              onClick={() => handleZipDownload(files)}
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
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
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

              <Button
                variant="outline"
                size="sm"
                onClick={toggleSortOrder}
                disabled={sortBy === 'manual'}
                className="p-2"
                title={sortOrder === 'asc' ? '昇順' : '降順'}
              >
                {sortOrder === 'asc' ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={files.length > 0 && files.every((file) => file.selected)}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all" className="text-sm cursor-pointer">
                全て選択
              </Label>
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
              ファイルを削除
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />

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
                  preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
                }))
                setFiles(newFiles)
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">ここにファイルをドラッグ&ドロップ</p>
              <p className="text-sm text-muted-foreground mt-2">
                または「ファイルをアップロード」ボタンをクリック
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {sortedFiles.map((file) => {
                const IconComponent = getFileIcon(file.type)
                return (
                  <Card
                    key={file.id}
                    className={cn(
                      'group cursor-pointer transition-all hover:shadow-md',
                      file.selected && 'ring-2 ring-primary',
                      draggedFile === file.id && 'opacity-50'
                    )}
                    draggable={sortBy === 'manual'}
                    onDragStart={() => handleDragStart(file.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, file.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <Checkbox
                          checked={file.selected}
                          onCheckedChange={() => handleFileSelect(file.id)}
                        />
                        {sortBy === 'manual' && (
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>

                      <div className="aspect-square mb-3 flex items-center justify-center bg-muted rounded-md overflow-hidden">
                        {file.preview ? (
                          <img
                            src={file.preview || '/placeholder.svg'}
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
                      'grid grid-cols-12 gap-4 p-3 border-t hover:bg-muted/50 transition-colors',
                      file.selected && 'bg-primary/10',
                      draggedFile === file.id && 'opacity-50'
                    )}
                    draggable={sortBy === 'manual'}
                    onDragStart={() => handleDragStart(file.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, file.id)}
                  >
                    <div className="col-span-1 flex items-center">
                      <Checkbox
                        checked={file.selected}
                        onCheckedChange={() => handleFileSelect(file.id)}
                      />
                    </div>
                    <div className="col-span-1 flex items-center">
                      {file.preview ? (
                        <img
                          src={file.preview || '/placeholder.svg'}
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
                      {formatDateTime(file.lastModified)}
                    </div>
                    <div className="col-span-1 flex items-center">
                      {sortBy === 'manual' && (
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      )}
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
                <Select
                  value={renamePattern}
                  onValueChange={(value: any) => setRenamePattern(value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sequential">連番のみ</SelectItem>
                    <SelectItem value="date">日付</SelectItem>
                    <SelectItem value="prefix">プレフィックス</SelectItem>
                    <SelectItem value="suffix">サフィックス</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">数字の桁数</Label>
                <Select
                  value={String(digitCount)}
                  onValueChange={(value) => setDigitCount(Number(value))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1桁</SelectItem>
                    <SelectItem value="2">2桁</SelectItem>
                    <SelectItem value="3">3桁</SelectItem>
                    <SelectItem value="4">4桁</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {renamePattern !== 'sequential' && (
                <>
                  <div>
                    <Label className="text-sm font-medium">区切り文字</Label>
                    <Input
                      value={separator}
                      onChange={(e) => setSeparator(e.target.value)}
                      placeholder="_"
                      className="mt-2"
                      maxLength={3}
                    />
                  </div>
                  {(renamePattern === 'prefix' || renamePattern === 'suffix') && (
                    <div>
                      <Label className="text-sm font-medium">
                        {renamePattern === 'prefix' ? 'プレフィックス' : 'サフィックス'}
                      </Label>
                      <Input
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        placeholder="追加テキスト"
                        className="mt-2"
                      />
                    </div>
                  )}
                </>
              )}

              <div>
                <Label className="text-sm font-medium mb-2 block">プレビュー</Label>
                <div className="bg-muted p-3 rounded-md text-sm">
                  {selectedFiles.slice(0, 3).map((file, index) => {
                    const extension = file.name.split('.').pop()
                    let preview = ''
                    let sequentialCounter = index + 1
                    
                    switch (renamePattern) {
                      case 'sequential':
                        // 連番のみ（プレフィックスなし）
                        preview = `${String(sequentialCounter).padStart(digitCount, '0')}.${extension}`
                        break
                      case 'date': {
                        // 日付 + 区切り文字 + 連番
                        const date = new Date().toISOString().split('T')[0]
                        preview = `${date}${separator}${String(sequentialCounter).padStart(digitCount, '0')}.${extension}`
                        break
                      }
                      case 'prefix':
                        // プレフィックス + 区切り文字 + 連番
                        preview = `${renameValue || 'prefix'}${separator}${String(sequentialCounter).padStart(digitCount, '0')}.${extension}`
                        break
                      case 'suffix':
                        // 連番 + 区切り文字 + サフィックス
                        preview = `${String(sequentialCounter).padStart(digitCount, '0')}${separator}${renameValue || 'suffix'}.${extension}`
                        break
                    }

                    return (
                      <div key={file.id} className="truncate">
                        {file.name} → {preview}
                      </div>
                    )
                  })}
                  {selectedFiles.length > 3 && (
                    <div className="text-muted-foreground">
                      ...他 {selectedFiles.length - 3} ファイル
                    </div>
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
                    <p className="text-sm font-medium">
                      {formatDateTime(selectedFiles[0].lastModified)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{selectedFiles.length}個のファイルを選択中</Badge>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">合計サイズ</Label>
                    <p className="text-sm font-medium">{formatFileSize(totalSize)}</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Footer Status Bar */}
      <footer className="border-t bg-card px-6 py-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {selectedFiles.length}個選択中 ({formatFileSize(totalSize)})
          </span>
          <span>全{files.length}ファイル</span>
        </div>
      </footer>
    </div>
  )
}
