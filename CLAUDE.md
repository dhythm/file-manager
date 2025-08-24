# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

ファイル名一括リネーマー - ファイルを一括でアップロードしてプレビュー表示し、一括でリネームしてZIP形式でダウンロードできる日本語のWebアプリケーション

## 技術スタック

- **フレームワーク**: Next.js 15.2.4 (App Router)
- **言語**: TypeScript 5
- **UI**: Tailwind CSS 4.1.9 + shadcn/ui
- **フォーム**: React Hook Form 7.60.0 + Zod
- **ZIP生成**: JSzip 3.10.1
- **パッケージマネージャー**: pnpm

## 開発コマンド

```sh
# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# リンター実行
pnpm lint

# プロダクションサーバー起動
pnpm start
```

## アーキテクチャ

### ディレクトリ構造
- `app/` - Next.js App Router（page.tsx に FileManager コンポーネント）
- `components/ui/` - shadcn/ui コンポーネント群
- `lib/utils.ts` - ユーティリティ関数（cn関数など）
- `hooks/` - カスタムフック（use-toast等）

### 主要コンポーネント
- `FileManager` - メインコンポーネント（app/page.tsx内）
  - ファイルアップロード（ドラッグ&ドロップ対応）
  - ファイルプレビュー（グリッド/リスト表示切替）
  - ファイル一括リネーム機能
  - ドラッグ&ドロップによる手動並び替え
  - ZIPダウンロード機能

### 状態管理
- React useState でローカル状態管理
- ファイル情報は FileItem インターフェースで管理
- 選択状態は Set<string> で管理

## 開発ガイドライン

### コーディング規約
- shadcn/ui コンポーネントを優先使用
- Tailwind CSS クラスで直接スタイリング
- 日本語UIテキストを使用
- ファイル操作は File API を使用
- 日時フォーマットは yyyy/mm/dd hh:mm:ss（JST）

### 注意事項
- テストフレームワークは未導入
- リンター/フォーマッターは Next.js デフォルトのみ
- ファイルアップロードは File API と FileReader を使用
- ZIP生成は JSzip ライブラリを使用