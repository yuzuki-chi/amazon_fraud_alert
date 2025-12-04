#!/bin/bash

# Chrome拡張機能のパッケージングスクリプト
# 使用方法: ./makezip.sh

SCRIPT_DIR=$(cd $(dirname $0); pwd)

# ビルドを実行
echo "Building TypeScript..."
cd "$SCRIPT_DIR"
npm run build

# zipファイルを作成
echo "Creating zip file..."
npm run package

echo "Done! fraud-alert.zip has been created."
