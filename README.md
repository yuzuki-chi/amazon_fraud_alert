# Fraud Alert for Amazon.co.jp

Amazon.co.jp に出品されている商品で、イラストの無断転用が報告されている商品に対して警告文を表示するChrome拡張機能です。

## 機能

- Amazon.co.jp の商品ページを開くと、自動的にデータベースを照会
- イラストの無断転用が報告されている商品の場合、ページ上部に警告を表示
- 著作者情報へのリンクを提供
- 未報告の商品について、新規報告が可能

## インストール方法

### Chrome ウェブストアから（推奨）

[Chrome ウェブストア](https://chrome.google.com/webstore/detail/fraudalert/jfbdagichcdaofdpgfafbhdmlfegibnd?hl=ja) からインストールできます。

### 開発版を手動でインストール

1. このリポジトリをクローンまたはダウンロード
   ```bash
   git clone https://github.com/yuzuki-chi/amazon_fraud_alert
   ```

2. 依存関係をインストールしてビルド
   ```bash
   cd extensions
   npm install
   npm run build
   ```

3. Chrome で `chrome://extensions/` を開く

4. 右上の「デベロッパーモード」を有効にする

5. 「パッケージ化されていない拡張機能を読み込む」をクリック

6. `extensions/dist` フォルダを選択

## 使い方

1. インストール後、Amazon.co.jp の商品ページにアクセスするだけで自動的に動作します
2. 無断転用が報告されている商品の場合、ページ上部に警告が表示されます
3. 「イラストの無断転用として報告する」リンクから新規報告も可能です

## 開発

### 必要な環境

- Node.js 18+
- npm

### ディレクトリ構成

```
amazon_fraud_alert/
├── extensions/
│   ├── src/                  # TypeScriptソースコード
│   │   ├── content.ts        # エントリーポイント
│   │   ├── creator.ts        # API通信・データ取得
│   │   ├── display.ts        # UI表示
│   │   ├── types.ts          # 型定義
│   │   └── manifest.json     # Chrome拡張機能の設定
│   ├── dist/                 # ビルド出力（gitignore対象）
│   ├── package.json
│   ├── tsconfig.json
│   └── makezip.sh
├── LICENSE
└── README.md
```

### ビルドコマンド

```bash
cd extensions

# 依存関係のインストール
npm install

# ビルド
npm run build

# 開発時の自動ビルド（ファイル変更を監視）
npm run watch

# Chrome ウェブストア提出用 zip ファイルを作成
npm run package
```

### 技術スタック

- **言語**: TypeScript
- **バンドラー**: esbuild
- **ターゲット**: ES2020

## 注意事項

- この拡張機能は Amazon.co.jp でのみ動作します

## ライセンス

[MIT License](LICENSE)

## 更新履歴

- **v1.1.0** - TypeScript化
- **v1.0.0** (2021/01/09) - 初版公開
