/**
 * display.ts
 * 表示を行うための関数
 */

import type { Creator } from "./types.js";

/**
 * 無断転用が報告されている商品の警告を表示する
 */
export function displayContent(creators: Creator[]): void {
  const creator = creators[0];
  const creatorAsin = creator.asin;
  const creatorLink = creator.link;
  const creatorName = creator.name;

  // dpはAmazonにおけるメインコンテンツ部分。その上に挿入する
  const dp = document.getElementById("dp");
  if (!dp) {
    console.error("dp element not found");
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.id = "fraud_alert_content";
  wrapper.style.textAlign = "center";
  wrapper.style.padding = "10px";
  wrapper.style.backgroundColor = "#EDF7FF";

  const alertTitle = document.createElement("div");
  alertTitle.textContent = "⚠️イラスト転用が報告されている商品です⚠️";
  alertTitle.style.fontSize = "20px";

  const creatorWrapper = document.createElement("div");
  creatorWrapper.style.paddingTop = "14px";
  creatorWrapper.style.fontSize = "20px";
  creatorWrapper.textContent = "著作者：";

  const creatorInfo = document.createElement("a");
  creatorInfo.href = creatorLink;
  creatorInfo.innerText = creatorName;
  creatorWrapper.appendChild(creatorInfo);

  const reportWrapper = document.createElement("div");
  reportWrapper.style.textAlign = "right";
  reportWrapper.style.paddingRight = "30px";

  const report = document.createElement("a");
  report.innerText = "情報の報告";
  report.href = `https://fraudalert.citron-tree.jp/edit/?asin=${creatorAsin}`;
  report.target = "_blank";
  reportWrapper.appendChild(report);

  wrapper.appendChild(alertTitle);
  wrapper.appendChild(creatorWrapper);
  wrapper.appendChild(reportWrapper);

  dp.before(wrapper);
}

/**
 * 未報告商品に対する報告フォームへのリンクを表示する
 */
export function displayForm(asin: string): void {
  console.log(`asin is ${asin}`);

  // dpはAmazonにおけるメインコンテンツ部分。その上に挿入する
  const dp = document.getElementById("dp");
  if (!dp) {
    console.error("dp element not found");
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.id = "fraud_alert_content";
  wrapper.style.textAlign = "center";
  wrapper.style.padding = "10px";
  wrapper.style.backgroundColor = "#EDF7FF";

  const formTitle = document.createElement("a");
  formTitle.textContent = "イラストの無断転用として報告する";
  formTitle.style.fontSize = "20px";
  formTitle.href = `https://fraudalert.citron-tree.jp/report/?asin=${asin}`;
  formTitle.target = "_blank";
  wrapper.appendChild(formTitle);

  dp.before(wrapper);
}

