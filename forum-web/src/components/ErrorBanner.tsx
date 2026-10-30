interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}
export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      style={{
        background: "#fee",
        border: "1px solid #fcc",
        color: "#900",
        padding: "10px 14px",
        borderRadius: 4,
        marginBottom: 16,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            color: "#900",
          }}
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}
