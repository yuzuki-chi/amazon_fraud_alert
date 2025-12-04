/**
 * ReportLink.tsx
 * 未報告商品に対する報告フォームへのリンク
 */

import { containerStyle } from "./styles.js";

export interface ReportLinkProps {
  asin: string;
}

export function ReportLink({ asin }: ReportLinkProps) {
  return (
    <div id="fraud_alert_content" style={containerStyle}>
      <a
        href={`https://fraudalert.citron-tree.jp/report/?asin=${asin}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: "20px" }}
      >
        <div style={{ fontSize: "14px" }}>
          見覚えのあるイラストですか？
        </div>
        <div style={{ paddingTop: "4px" }}>
          イラストの無断転用として報告する
        </div>
      </a>
    </div>
  );
}

