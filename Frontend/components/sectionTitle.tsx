import { ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div
      style={{
        fontSize: 13,
        fontFamily: "'DM Mono', monospace",
        color: "#94a3b8",
        letterSpacing: 2,
        textTransform: "uppercase",
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          width: 18,
          height: 2,
          background: "#38bdf8",
          display: "inline-block",
        }}
      />
      {children}
    </div>
  );
}
