/**
 * creator.ts
 * クリエイター情報を取得するための関数
 */

import type { GetCreatorResult, ApiResponse } from "./types.js";

/**
 * ASINを元にクリエイター情報を取得する
 * @returns GetCreatorResult
 *   -1  : エラー (error_messageを確認)
 *    0  : ASINを検索したところ、該当者がヒットしなかった (asinを返す)
 *    1  : ASINを検索したところ、該当者がヒットした (creator情報を返す)
 *  501  : ASINが無いページ
 */
export function getCreator(): GetCreatorResult {
  // ASIN番号を取得する
  const detailBullets = document.getElementById("detailBullets_feature_div");
  if (detailBullets === null) {
    return { status: 501 };
  }

  const ulElements = detailBullets.getElementsByTagName("ul");
  if (ulElements.length === 0) {
    return { status: 501 };
  }

  const textContent = ulElements[0].textContent ?? "";
  const splitParts = textContent.split(":");

  // ASIN番号が含まれている位置を調べる
  let asinIndex = -1;
  for (let i = 0; i < splitParts.length; i++) {
    if (splitParts[i].indexOf("ASIN") !== -1) {
      asinIndex = i + 1;
      break;
    }
  }

  if (asinIndex === -1 || asinIndex >= splitParts.length) {
    return { status: -1, error_message: "ASINの取得に失敗しました" };
  }

  // ASINを抽出（英数字のみ）
  const tmp = splitParts[asinIndex].replace(/\n/g, " ");
  const asin = tmp.replace(/[^A-Za-z0-9]/g, "");

  // APIリクエスト
  // TODO: XMLHttpRequestは非推奨のため、将来的にfetchへの移行を検討
  const request = new XMLHttpRequest();
  request.open(
    "GET",
    `https://fraudalert.citron-tree.jp/api/?asin=${asin}`,
    false
  );
  request.send();

  if (request.status === 200) {
    const result: ApiResponse = JSON.parse(request.responseText);

    if (result.status === -1) {
      console.log("著作者検索の際にサーバ側でエラーが発生しました");
      return {
        status: -1,
        error_message: "著作者検索の際にサーバ側でエラーが発生しました",
      };
    }

    if (result.hit === 0 || !result.creator) {
      console.log("該当者がヒットしませんでした");
      return { status: 0, asin };
    }

    console.log("該当者がヒットしました");
    return { status: 1, creator: result.creator };
  }

  return { status: -1, error_message: "APIリクエストに失敗しました" };
}

