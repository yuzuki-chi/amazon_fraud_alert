/**
 * types.ts
 * 共通の型定義
 */

/** 著作者情報 */
export interface Creator {
  asin: string;
  link: string;
  name: string;
}

/** APIレスポンス */
export interface ApiResponse {
  status: number;
  hit?: number;
  creator?: Creator[];
}

/** getCreator の戻り値 */
export type GetCreatorResult =
  | { status: -1; error_message: string }
  | { status: 0; asin: string }
  | { status: 1; creator: Creator[] }
  | { status: 501 };

