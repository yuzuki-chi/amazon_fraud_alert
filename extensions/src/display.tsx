/**
 * display.tsx
 * 表示処理
 */

import { render } from "preact";
import type { AsinData } from "./types.js";
import { AlertBanner, AsinForm, ReportLink } from "./components/index.js";

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

/**
 * ASIN新規作成フォームを表示する
 */
export function displayAsinForm(asin: string): void {
  console.log(`ASINフォームを表示: ${asin}`);

  const mountPoint = createMountPoint();
  if (!mountPoint) return;

  render(<AsinForm asin={asin} />, mountPoint);
}

/**
 * 未報告商品に対する報告フォームへのリンクを表示する（後方互換性のため残す）
 */
export function displayForm(asin: string): void {
  displayAsinForm(asin);
}

/**
 * レガシー: 未報告商品に対する報告フォームへのリンクを表示する
 */
export function displayReportLink(asin: string): void {
  console.log(`報告リンクを表示: ${asin}`);

  const mountPoint = createMountPoint();
  if (!mountPoint) return;

  render(<ReportLink asin={asin} />, mountPoint);
}
