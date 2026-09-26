#!/bin/bash
# nginx 用にビルド成果物をコピーするスクリプト
# コマンド：bash script/cpBuildingToNginx.sh
set -euo pipefail

# どこから実行しても正しく解決できるよう、スクリプト自身の場所を基準にする
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="$SCRIPT_DIR/../dist"
DEPLOY_DIR="/var/www/picture-viewer"

if [ ! -d "$DIST_DIR" ]; then
  echo "dist directory not found: $DIST_DIR (run 'npm run build' first)" >&2
  exit 1
fi

# --delete で旧ビルドの削除済みファイルも公開先から取り除く
sudo rsync -a --delete "$DIST_DIR"/ "$DEPLOY_DIR"/

