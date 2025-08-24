# 設計ファイル - ZIPダウンロード機能

## 1. アーキテクチャ設計

### 1.1 全体構成
```
[FileManager Component]
    ↓
[ZIP生成処理]
    ├── JSZipライブラリ
    ├── ファイルデータ取得
    └── Blob生成・ダウンロード
```

### 1.2 処理フロー
1. ユーザーがファイルを選択
2. 「ZIPダウンロード」ボタンをクリック
3. 選択されたファイルのデータを収集
4. JSZipでZIPファイルを生成
5. Blobとしてダウンロード用URLを作成
6. ブラウザのダウンロード機能を起動

## 2. コンポーネント設計

### 2.1 既存コンポーネントの修正
**FileManager (app/page.tsx)**
- ZIPダウンロード機能の実装を追加
- ボタンのクリックイベントハンドラを実装

### 2.2 新規追加する関数

#### handleZipDownload関数
```typescript
const handleZipDownload = async (): Promise<void>
```
- 選択されたファイルをZIP化してダウンロード
- エラーハンドリングを含む

#### generateMockFileContent関数
```typescript
const generateMockFileContent = (file: FileItem): Blob
```
- サンプルファイルの模擬コンテンツを生成
- ファイルタイプに応じた適切なデータを返す

## 3. データ設計

### 3.1 既存のFileItemインターフェイス（変更なし）
```typescript
interface FileItem {
  id: string
  name: string
  size: number
  type: string
  lastModified: Date
  selected: boolean
  preview?: string
}
```

### 3.2 ZIP生成時のデータ構造
```typescript
type ZipFileEntry = {
  filename: string  // ZIPに格納するファイル名
  content: Blob     // ファイルコンテンツ
}
```

## 4. ライブラリ設計

### 4.1 JSZipライブラリ
- バージョン: 最新安定版（3.10.x）
- インストール: `pnpm add jszip @types/jszip`

### 4.2 使用するAPI
```typescript
import JSZip from 'jszip'

// ZIP作成
const zip = new JSZip()
zip.file(filename, content)
const blob = await zip.generateAsync({ type: 'blob' })
```

## 5. UI/UX設計

### 5.1 ボタンの状態管理
- **通常状態**: ファイル選択時に有効
- **無効状態**: ファイル未選択時（現状維持）
- **処理中状態**: ZIP生成中はローディング表示

### 5.2 フィードバック
- ZIP生成開始時: ボタンをローディング状態に
- 完了時: 自動的にダウンロード開始
- エラー時: トースト通知でエラーメッセージ表示

## 6. エラーハンドリング設計

### 6.1 想定されるエラー
- メモリ不足
- ファイル生成失敗
- ブラウザの制限

### 6.2 エラー処理方針
```typescript
try {
  // ZIP生成処理
} catch (error) {
  // ユーザーへの通知
  console.error('ZIP生成エラー:', error)
  // トースト通知の表示
}
```

## 7. モックデータ生成設計

### 7.1 ファイルタイプ別のモックコンテンツ
- **画像ファイル**: プレースホルダー画像またはBase64データ
- **テキストファイル**: サンプルテキスト
- **PDFファイル**: 簡単なPDFバイナリ
- **その他**: ファイル情報を含むテキスト

### 7.2 実装方針
```typescript
switch (file.type) {
  case 'image/jpeg':
  case 'image/png':
    return generateImageBlob(file)
  case 'text/plain':
    return new Blob([`Sample content for ${file.name}`], { type: 'text/plain' })
  default:
    return new Blob([`File: ${file.name}\nSize: ${file.size}\nType: ${file.type}`])
}
```

## 8. パフォーマンス設計

### 8.1 非同期処理
- async/awaitを使用した非同期ZIP生成
- UIのブロッキングを防ぐ

### 8.2 メモリ管理
- 生成したBlobURLは使用後に解放
```typescript
URL.revokeObjectURL(url)
```

## 9. ファイル名設計

### 9.1 ZIPファイル名形式
```
files_YYYYMMDD_HHMMSS.zip
```
例: `files_20240115_143025.zip`

### 9.2 タイムスタンプ生成
```typescript
const timestamp = new Date().toISOString()
  .replace(/[^0-9]/g, '')
  .slice(0, 14)
```