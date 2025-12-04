/**
 * display.tsx
 * 表示処理
 */

import { render } from "preact";
import type { Creator } from "./types.js";
import { AlertBanner, ReportLink } from "./components/index.js";

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
export function displayContent(creators: Creator[]): void {
  const creator = creators[0];
  const mountPoint = createMountPoint();
  if (!mountPoint) return;

  render(
    <AlertBanner
      creatorName={creator.name}
      creatorLink={creator.link}
      asin={creator.asin}
    />,
    mountPoint
  );
}

/**
 * 未報告商品に対する報告フォームへのリンクを表示する
 */
export function displayForm(asin: string): void {
  console.log(`asin is ${asin}`);

  const mountPoint = createMountPoint();
  if (!mountPoint) return;

  render(<ReportLink asin={asin} />, mountPoint);
}
