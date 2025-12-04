/**
 * AlertBanner.tsx
 * 無断転用が報告されている商品の警告バナー
 */

import { containerStyle } from "./styles.js";

export interface AlertBannerProps {
  creatorName: string;
  creatorLink: string;
  asin: string;
}

export function AlertBanner({ creatorName, creatorLink, asin }: AlertBannerProps) {
  return (
    <div id="fraud_alert_content" style={containerStyle}>
      <div style={{ fontSize: "20px" }}>
        ⚠️イラスト転用が報告されている商品です⚠️
      </div>
      <div style={{ paddingTop: "14px", fontSize: "20px" }}>
        著作者：
        <a href={creatorLink}>{creatorName}</a>
      </div>
      <div style={{ textAlign: "right", paddingRight: "30px" }}>
        <a
          href={`https://fraudalert.citron-tree.jp/edit/?asin=${asin}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          情報の報告
        </a>
      </div>
    </div>
  );
}

