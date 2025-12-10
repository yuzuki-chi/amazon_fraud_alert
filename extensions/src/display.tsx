/**
 * display.tsx
 * 表示処理
 */

import { render } from "preact";
import type { AsinData } from "./types.js";
import { AlertBanner } from "./components/index.js";

/**
 * Amazonのメインコンテンツ（dp）の前にコンポーネントを挿入するためのコンテナを作成
 */
function createMountPoint(): HTMLElement | null {
  const dp = document.getElementById("dp");
  if (!dp) {
    console.error("dp element not found");
    return null;
  }

  const mountPoint = document.createElement("div");
  mountPoint.id = "fraud_alert_mount";
  dp.before(mountPoint);
  return mountPoint;
}

/**
 * 無断転用が報告されている商品の警告を表示する
 */
export function displayAlertBanner(data: AsinData): void {
  const mountPoint = createMountPoint();
  if (!mountPoint) return;

  render(<AlertBanner data={data} />, mountPoint);
}
