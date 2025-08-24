# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

ファイル名一括リネーマー - ファイルを一括でアップロードしてプレビュー表示し、一括でリネームしてZIP形式でダウンロードできる日本語のWebアプリケーション

## 開発ガイドライン

### 要件
- TDD で実装を進める
- 画面は Playwright MCP にて確認

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