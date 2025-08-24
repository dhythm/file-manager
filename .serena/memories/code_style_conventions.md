# コードスタイルと規約

## TypeScript設定
- **strict**: true（厳格な型チェック有効）
- **target**: ES6
- **module**: esnext
- **jsx**: preserve
- **パスエイリアス**: `@/*` で`./*`を参照

## React/Next.js規約
- **React**: バージョン19使用
- **コンポーネント**: 関数コンポーネント（アロー関数）で記述
- **Hooks**: useState, useRef等を活用
- **型定義**: TypeScriptの型を活用

## 命名規則
- **コンポーネント**: PascalCase（例: FileManager, FileItem）
- **関数**: camelCase（例: handleFileUpload, formatFileSize）
- **定数**: camelCase（例: sampleFiles, droppedFiles）
- **イベントハンドラー**: handle接頭辞（例: handleDragOver, handleSelectAll）

## スタイリング
- **Tailwind CSS**: クラスベースのスタイリング
- **shadcn/ui**: UIコンポーネントライブラリ
- **class-variance-authority (cva)**: 条件付きスタイリング
- **clsx + tailwind-merge**: クラス名の結合

## ファイル構成
- 1ファイル1コンポーネントが基本
- shadcn/uiコンポーネントは`components/ui/`に配置
- Next.js App Routerの規約に従う