import { useState, useEffect } from "react";

function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // päivitä minuutin alussa
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="text-right text-xl font-mono">
      {now.toLocaleDateString([], { hour: "2-digit", minute: "2-digit" })}
    </div>
  );
}

export default Clock;
