export function Loading({ label = "Loading..." }: { label?: string }) {
  return (
    <div style={{ textAlign: "center", padding: 24, color: "#666" }}>
      <div
        style={{
          display: "inline-block",
          width: 24,
          height: 24,
          border: "2px solid #ddd",
          borderTopColor: "#333",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          marginBottom: 8,
        }}
      ></div>
      <div>{label}</div>
    </div>
  );
}
