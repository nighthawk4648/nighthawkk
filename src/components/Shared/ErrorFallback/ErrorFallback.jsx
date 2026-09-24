import { FaExclamationTriangle } from "react-icons/fa";

export const ErrorFallback = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #090d16 0%, #111827 100%)",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          padding: "2rem 2.5rem",
          background: "#1f2937",
          border: "1px solid rgba(75, 85, 99, 0.5)",
          maxWidth: "420px",
          margin: "1rem",
        }}
      >
        <FaExclamationTriangle
          size={48}
          color="#f59e0b"
          style={{ marginBottom: "1rem" }}
        />
        <h2
          style={{
            color: "#f3f4f6",
            marginBottom: "0.5rem",
            fontWeight: 600,
            fontSize: "1.25rem",
          }}
        >
          Something went wrong
        </h2>
        <p
          style={{
            color: "#9ca3af",
            fontSize: "0.95rem",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Please try refreshing the page or check your connection if the problem
          persists.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "1.5rem",
            padding: "0.5rem 1.25rem",
            background: "#2563eb",
            color: "#ffffff",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};
