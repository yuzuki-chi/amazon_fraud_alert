/**
 * content.ts
 * Entry point
 */

import { getCreator } from "./creator.js";
import { displayContent, displayForm } from "./display.js";

console.log("fraud_alert is running...");

const result = getCreator();

switch (result.status) {
  case -1:
    // エラー
    console.log(`[error] ${result.error_message}`);
    break;

  case 501:
    // ASINがあるページではないため終了
    console.log("[success] This page has not ASIN.");
    break;

  case 0:
    // 該当者なし
    displayForm(result.asin);
    break;

  case 1:
    // 該当者あり
    displayContent(result.creator);
    break;

  default:
    console.log("原因不明のエラーが発生しました。開発者に問い合わせください。");
    break;
}

console.log("fraud_alert was finished");

