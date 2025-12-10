/**
 * popup.tsx
 * Popup UI - 報告フォーム
 */

import { render } from "preact";
import { useState, useEffect } from "preact/hooks";
import { createAsin } from "./creator.js";
import type { AsinData } from "./types.js";
import { API_BASE_URL } from "./types.js";

/** ポップアップのスタイル */
const styles = {
  container: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "16px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "16px",
    textAlign: "center" as const,
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    marginBottom: "4px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    minHeight: "60px",
    resize: "vertical" as const,
  },
  button: {
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#e74c3c",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "8px",
  },
  message: {
    padding: "10px 12px",
    borderRadius: "4px",
    fontSize: "13px",
    textAlign: "center" as const,
  },
  info: {
    backgroundColor: "#e3f2fd",
    padding: "12px",
    borderRadius: "4px",
    fontSize: "13px",
    color: "#1565c0",
    textAlign: "center" as const,
  },
  warning: {
    backgroundColor: "#fff3e0",
    padding: "12px",
    borderRadius: "4px",
    fontSize: "13px",
    color: "#e65100",
    textAlign: "center" as const,
  },
  registered: {
    backgroundColor: "#ffebee",
    padding: "16px",
    borderRadius: "4px",
    textAlign: "center" as const,
  },
  asinBadge: {
    display: "inline-block",
    backgroundColor: "#f0f0f0",
    padding: "4px 8px",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontSize: "14px",
  },
};

interface PageInfo {
  asin: string | null;
  isAmazonPage: boolean;
  registeredData: AsinData | null;
}

function Popup() {
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [creatorName, setCreatorName] = useState("");
  const [creatorSource, setCreatorSource] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    // 現在のタブからページ情報を取得
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      if (!tab?.url) {
        setPageInfo({ asin: null, isAmazonPage: false, registeredData: null });
        return;
      }

      const isAmazonPage = tab.url.includes("amazon.co.jp");
      if (!isAmazonPage) {
        setPageInfo({ asin: null, isAmazonPage: false, registeredData: null });
        return;
      }

      // URLからASINを抽出
      const dpMatch = tab.url.match(/\/dp\/([A-Z0-9]{10})/i);
      const gpMatch = tab.url.match(/\/gp\/product\/([A-Z0-9]{10})/i);
      const asin = (dpMatch?.[1] || gpMatch?.[1])?.toUpperCase() || null;

      if (!asin) {
        setPageInfo({ asin: null, isAmazonPage: true, registeredData: null });
        return;
      }

      // APIで登録済みか確認
      try {
        const response = await fetch(`${API_BASE_URL}/asin/${asin}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setPageInfo({ asin, isAmazonPage: true, registeredData: result.data });
            return;
          }
        }
      } catch (e) {
        console.error("API check error:", e);
      }

      setPageInfo({ asin, isAmazonPage: true, registeredData: null });
    });
  }, []);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!pageInfo?.asin) return;

    if (!creatorName.trim()) {
      setMessage({ type: "error", text: "著作者名は必須です" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const result = await createAsin(
      pageInfo.asin,
      creatorName.trim(),
      creatorSource.trim() || undefined,
      description.trim() || undefined
    );

    setIsSubmitting(false);

    if (result.success) {
      setMessage({ type: "success", text: result.message });
      // 成功時は登録済み状態に更新
      setTimeout(() => {
        // ページをリロードして警告バナーを表示
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            chrome.tabs.reload(tabs[0].id);
          }
        });
        window.close();
      }, 1500);
    } else {
      setMessage({ type: "error", text: result.message });
    }
  };

  // ローディング中
  if (pageInfo === null) {
    return (
      <div style={styles.container}>
        <div style={styles.title}>🔍 読み込み中...</div>
      </div>
    );
  }

  // Amazonページではない
  if (!pageInfo.isAmazonPage) {
    return (
      <div style={styles.container}>
        <div style={styles.title}>🛒 Fraud Alert</div>
        <div style={styles.warning}>
          Amazon.co.jp の商品ページで使用してください
        </div>
      </div>
    );
  }

  // ASINが見つからない
  if (!pageInfo.asin) {
    return (
      <div style={styles.container}>
        <div style={styles.title}>🛒 Fraud Alert</div>
        <div style={styles.info}>
          商品詳細ページ（/dp/...）で使用してください
        </div>
      </div>
    );
  }

  // 既に登録済み
  if (pageInfo.registeredData) {
    return (
      <div style={styles.container}>
        <div style={styles.title}>⚠️ 報告済みの商品</div>
        <div style={styles.registered}>
          <div style={{ marginBottom: "8px" }}>
            ASIN: <span style={styles.asinBadge}>{pageInfo.asin}</span>
          </div>
          <div style={{ fontSize: "15px", marginBottom: "4px" }}>
            著作者: <strong>{pageInfo.registeredData.creator_name}</strong>
          </div>
          {pageInfo.registeredData.creator_source && (
            <div style={{ fontSize: "13px" }}>
              <a
                href={pageInfo.registeredData.creator_source}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#2980b9" }}
              >
                著作者のページ →
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 報告フォーム
  return (
    <div style={styles.container}>
      <div style={styles.title}>🚨 イラスト転用を報告</div>

      <div style={{ marginBottom: "16px", textAlign: "center" }}>
        ASIN: <span style={styles.asinBadge}>{pageInfo.asin}</span>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <label style={styles.label}>
            著作者名 <span style={{ color: "#e74c3c" }}>*</span>
          </label>
          <input
            type="text"
            value={creatorName}
            onInput={(e) => setCreatorName((e.target as HTMLInputElement).value)}
            placeholder="例: イラストレーター名"
            style={styles.input}
            required
          />
        </div>

        <div>
          <label style={styles.label}>著作者のURL（任意）</label>
          <input
            type="url"
            value={creatorSource}
            onInput={(e) => setCreatorSource((e.target as HTMLInputElement).value)}
            placeholder="例: https://twitter.com/..."
            style={styles.input}
          />
        </div>

        <div>
          <label style={styles.label}>備考（任意）</label>
          <textarea
            value={description}
            onInput={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
            placeholder="詳細な情報があれば記入"
            style={styles.textarea}
          />
        </div>

        {message && (
          <div
            style={{
              ...styles.message,
              color: message.type === "success" ? "#27ae60" : "#e74c3c",
              backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
            }}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...styles.button,
            opacity: isSubmitting ? 0.6 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "送信中..." : "報告する"}
        </button>
      </form>
    </div>
  );
}

// マウント
const app = document.getElementById("app");
if (app) {
  render(<Popup />, app);
}
