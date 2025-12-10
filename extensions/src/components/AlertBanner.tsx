/**
 * AlertBanner.tsx
 * 無断転用が報告されている商品の警告バナー
 */

import { containerStyle, titleStyle } from "./styles.js";
import type { AsinData } from "../types.js";

export interface AlertBannerProps {
  data: AsinData;
}

export function AlertBanner({ data }: AlertBannerProps) {
  return (
    <div id="fraud_alert_content" style={containerStyle}>
      <div style={titleStyle}>
        ⚠️ イラスト転用が報告されている商品です ⚠️
      </div>
      <div style={{ paddingTop: "8px", fontSize: "18px" }}>
        著作者：
        {data.creator_source ? (
          <a
            href={data.creator_source}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#2980b9", textDecoration: "underline" }}
          >
            {data.creator_name}
          </a>
        ) : (
          <strong>{data.creator_name}</strong>
        )}
      </div>
      {data.description && (
        <div style={{ paddingTop: "8px", fontSize: "14px", color: "#666" }}>
          {data.description}
        </div>
      )}
      <div style={{ paddingTop: "12px", fontSize: "12px", color: "#888" }}>
        報告日時: {new Date(data.created_at).toLocaleDateString("ja-JP")}
      </div>
    </div>
  );
}
