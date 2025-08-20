import { useState, useEffect } from "react";

export default function Clock({ format = "HH:mm", className = "" }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(id); }, []);
  const text = new Intl.DateTimeFormat(undefined, {
    day: format.includes("dd") ? "2-digit" : undefined,
    month: format.includes("MM") ? "2-digit" : undefined,
    year: format.includes("yyyy") ? "numeric" : undefined,
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);
  return <div className={className}>{text}</div>;
}
