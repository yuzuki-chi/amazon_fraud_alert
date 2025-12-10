/**
 * AsinForm.tsx
 * ASIN新規作成用フォーム
 */

import { useState } from "preact/hooks";
import { createAsin } from "../creator.js";
import {
  containerStyle,
  formStyle,
  inputStyle,
  textareaStyle,
  buttonStyle,
  labelStyle,
  messageStyle,
  titleStyle,
} from "./styles.js";

export interface AsinFormProps {
  asin: string;
}

export function AsinForm({ asin }: AsinFormProps) {
  const [creatorName, setCreatorName] = useState("");
  const [creatorSource, setCreatorSource] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!creatorName.trim()) {
      setMessage({ type: "error", text: "著作者名は必須です" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const result = await createAsin(
      asin,
      creatorName.trim(),
      creatorSource.trim() || undefined,
      description.trim() || undefined
    );

    setIsSubmitting(false);

    if (result.success) {
      setMessage({ type: "success", text: result.message });
      // 成功時はページをリロードして警告バナーを表示
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setMessage({ type: "error", text: result.message });
    }
  };

  return (
    <div id="fraud_alert_content" style={containerStyle}>
      <div style={titleStyle}>
        🚨 イラストの無断転用を報告する
      </div>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label style={labelStyle}>
            ASIN: <strong>{asin}</strong>
          </label>
        </div>

        <div>
          <label style={labelStyle}>
            著作者名 <span style={{ color: "#e74c3c" }}>*</span>
          </label>
          <input
            type="text"
            value={creatorName}
            onInput={(e) => setCreatorName((e.target as HTMLInputElement).value)}
            placeholder="例: イラストレーター名"
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label style={labelStyle}>
            著作者のURL（任意）
          </label>
          <input
            type="url"
            value={creatorSource}
            onInput={(e) => setCreatorSource((e.target as HTMLInputElement).value)}
            placeholder="例: https://twitter.com/..."
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>
            備考（任意）
          </label>
          <textarea
            value={description}
            onInput={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
            placeholder="詳細な情報があれば記入してください"
            style={textareaStyle}
          />
        </div>

        {message && (
          <div style={{
            ...messageStyle,
            color: message.type === "success" ? "#27ae60" : "#e74c3c",
            backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
          }}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...buttonStyle,
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
