/**
 * content.ts
 * Entry point
 */

import { checkAsin } from "./creator.js";
import { displayAlertBanner, displayAsinForm } from "./display.js";

console.log("fraud_alert is running...");

const result = checkAsin();

switch (result.status) {
  case "error":
    // エラー
    console.error(`[error] ${result.error_message}`);
    break;

  case "no_asin_page":
    // ASINがあるページではないため終了
    console.log("[success] This page has not ASIN.");
    break;

  case "not_found":
    // ASINがDBに存在しない → 報告フォームを表示
    displayAsinForm(result.asin);
    break;

  case "found":
    // ASINがDBに存在する → 警告バナーを表示
    displayAlertBanner(result.data);
    break;

  default:
    console.log("原因不明のエラーが発生しました。開発者に問い合わせください。");
    break;
}

console.log("fraud_alert was finished");
