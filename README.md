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

2. Chrome で `chrome://extensions/` を開く

3. 右上の「デベロッパーモード」を有効にする

4. 「パッケージ化されていない拡張機能を読み込む」をクリック

5. `front/src` フォルダを選択

## 使い方

1. インストール後、Amazon.co.jp の商品ページにアクセスするだけで自動的に動作します
2. 無断転用が報告されている商品の場合、ページ上部に警告が表示されます
3. 「イラストの無断転用として報告する」リンクから新規報告も可能です

## 開発

### ディレクトリ構成

```
amazon_fraud_alert/
├── front/
│   ├── src/
│   │   ├── manifest.json    # Chrome拡張機能の設定ファイル
│   │   └── js/
│   │       ├── content.js   # エントリーポイント
│   │       ├── creator.js   # API通信・データ取得
│   │       └── display.js   # UI表示
│   └── makezip.sh           # 配布用zipファイル作成スクリプト
└── README.md
```

### ビルド

Chrome ウェブストアへの提出用 zip ファイルを作成：

```bash
cd front
./makezip.sh
```

## 注意事項

- この拡張機能は Amazon.co.jp でのみ動作します
- 現在 Manifest V2 を使用しています（将来的に V3 への移行が必要になる可能性があります）

## ライセンス

[MIT License](LICENSE)

## 更新履歴

- **v1.00** (2021/01/09) - 初版公開
