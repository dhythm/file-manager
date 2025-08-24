# 開発用コマンド一覧

## 基本コマンド
```sh
# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# プロダクションサーバー起動
pnpm start

# リンター実行
pnpm lint
```

## パッケージ管理
```sh
# 依存関係のインストール
pnpm install

# パッケージの追加
pnpm add [package-name]

# 開発依存の追加
pnpm add -D [package-name]
```

## Git操作
```sh
# ステータス確認
git status

# 変更の追加
git add -A

# コミット
git commit -m "message"

# プッシュ
git push origin main
```

## システムコマンド（macOS/Darwin）
```sh
# ファイル一覧
ls -la

# ディレクトリ移動
cd [directory]

# ファイル内容確認
cat [file]

# 検索（ripgrep推奨）
rg [pattern]

# ファイル検索
find . -name "*.tsx"
```

## プロジェクト固有
```sh
# Serena MCP起動
claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant --project $(pwd)
```