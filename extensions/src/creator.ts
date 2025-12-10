/**
 * creator.ts
 * ASINの取得とAPI呼び出しの関数
 */

import type { CheckAsinResult, AsinGetResponse } from "./types.js";
import { API_BASE_URL } from "./types.js";

/**
 * URLからASIN番号を抽出する
 * AmazonのURL形式: /dp/{ASIN}/ または /gp/product/{ASIN}/
 */
function extractAsinFromUrl(): string | null {
  const url = window.location.pathname;

  // /dp/{ASIN} パターン
  const dpMatch = url.match(/\/dp\/([A-Z0-9]{10})/i);
  if (dpMatch) {
    return dpMatch[1].toUpperCase();
  }

  // /gp/product/{ASIN} パターン（古い形式）
  const gpMatch = url.match(/\/gp\/product\/([A-Z0-9]{10})/i);
  if (gpMatch) {
    return gpMatch[1].toUpperCase();
  }

  return null;
}

/**
 * ASINを元にAPI（/api/asin/{asin}）から情報を取得する
 * @returns CheckAsinResult
 *   - "error"       : APIエラー (error_messageを確認)
 *   - "not_found"   : ASINがDBに存在しない (asinを返す)
 *   - "found"       : ASINがDBに存在する (dataを返す)
 *   - "no_asin_page": ASINが無いページ
 */
export function checkAsin(): CheckAsinResult {
  // URLからASIN番号を取得する
  const asin = extractAsinFromUrl();
  if (asin === null) {
    return { status: "no_asin_page" };
  }

  // APIリクエスト（同期リクエスト）
  // TODO: XMLHttpRequestは非推奨のため、将来的にfetchへの移行を検討
  const request = new XMLHttpRequest();
  request.open("GET", `${API_BASE_URL}/asin/${asin}`, false);
  request.setRequestHeader("Accept", "application/json");
  request.send();

  try {
    const response: AsinGetResponse = JSON.parse(request.responseText);

    if (request.status === 200 && response.success) {
      console.log("ASINがDBに登録されています:", response.data.asin);
      return { status: "found", data: response.data };
    }

    if (request.status === 404) {
      console.log("ASINがDBに存在しません:", asin);
      return { status: "not_found", asin };
    }

    // その他のエラー
    console.error("APIエラー:", response);
    return {
      status: "error",
      error_message: "message" in response ? response.message : "Unknown error",
    };
  } catch (e) {
    console.error("APIレスポンスのパースに失敗:", e);
    return {
      status: "error",
      error_message: "APIレスポンスのパースに失敗しました",
    };
  }
}

/**
 * 新規ASIN作成APIを呼び出す
 */
export async function createAsin(
  asin: string,
  creatorName: string,
  creatorSource?: string,
  description?: string
): Promise<{ success: boolean; message: string }> {
  const formData = new FormData();
  formData.append("asin", asin);
  formData.append("creator_name", creatorName);
  if (creatorSource) {
    formData.append("creator_source", creatorSource);
  }
  if (description) {
    formData.append("description", description);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/asin/create`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return { success: true, message: "登録が完了しました" };
    }

    // バリデーションエラー
    if (result.errors) {
      const errorMessages = Object.values(result.errors).join(", ");
      return { success: false, message: errorMessages };
    }

    // 既に存在する場合
    if (response.status === 409) {
      return { success: false, message: "このASINは既に登録されています" };
    }

    return { success: false, message: result.message || "登録に失敗しました" };
  } catch (e) {
    console.error("ASIN作成エラー:", e);
    return { success: false, message: "ネットワークエラーが発生しました" };
  }
}
