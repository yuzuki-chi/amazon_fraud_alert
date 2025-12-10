/**
 * types.ts
 * 共通の型定義
 */

/** APIのベースURL（ビルド時に .env から注入される） */
declare const process: { env: { API_BASE_URL: string } };
export const API_BASE_URL = process.env.API_BASE_URL;

/** ASIN情報（APIレスポンス） */
export interface AsinData {
  id: number;
  asin: string;
  creator_name: string;
  creator_source: string | null;
  user_identifier: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

/** GET /api/asin/{asin} のレスポンス（成功時） */
export interface AsinGetSuccessResponse {
  success: true;
  data: AsinData;
}

/** GET /api/asin/{asin} のレスポンス（404時） */
export interface AsinGetNotFoundResponse {
  success: false;
  message: string;
}

/** GET /api/asin/{asin} のレスポンス */
export type AsinGetResponse = AsinGetSuccessResponse | AsinGetNotFoundResponse;

/** POST /api/asin/create のリクエストボディ */
export interface AsinCreateRequest {
  asin: string;
  creator_name: string;
  creator_source?: string;
  description?: string;
}

/** POST /api/asin/create のレスポンス（成功時） */
export interface AsinCreateSuccessResponse {
  success: true;
  message: string;
  data: AsinData;
}

/** POST /api/asin/create のレスポンス（エラー時） */
export interface AsinCreateErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

/** POST /api/asin/create のレスポンス */
export type AsinCreateResponse = AsinCreateSuccessResponse | AsinCreateErrorResponse;

/** checkAsin の戻り値 */
export type CheckAsinResult =
  | { status: "error"; error_message: string }
  | { status: "not_found"; asin: string }
  | { status: "found"; data: AsinData }
  | { status: "no_asin_page" };
