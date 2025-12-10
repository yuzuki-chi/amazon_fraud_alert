import type { JSX } from "preact";

export const containerStyle: JSX.CSSProperties = {
  textAlign: "center",
  padding: "16px",
  backgroundColor: "#EDF7FF",
  borderRadius: "8px",
  margin: "10px 0",
};

export const titleStyle: JSX.CSSProperties = {
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "16px",
  color: "#333",
};

export const formStyle: JSX.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  maxWidth: "500px",
  margin: "0 auto",
  textAlign: "left",
};

export const labelStyle: JSX.CSSProperties = {
  display: "block",
  fontSize: "14px",
  fontWeight: "500",
  marginBottom: "4px",
  color: "#333",
};

export const inputStyle: JSX.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  fontSize: "14px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box",
};

export const textareaStyle: JSX.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  fontSize: "14px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  minHeight: "80px",
  resize: "vertical",
  boxSizing: "border-box",
};

export const buttonStyle: JSX.CSSProperties = {
  padding: "12px 24px",
  fontSize: "16px",
  fontWeight: "bold",
  color: "#fff",
  backgroundColor: "#e74c3c",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "background-color 0.2s",
};

export const messageStyle: JSX.CSSProperties = {
  padding: "10px 12px",
  borderRadius: "4px",
  fontSize: "14px",
  textAlign: "center",
};
