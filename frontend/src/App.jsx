import { useEffect, useState, useMemo } from "react";
import Clock from "./components/Clock";

const STOP_ID = "9013799"; // Busestr.

function MinutesLeft({ iso }) {
  const [mins, setMins] = useState(0);
  useEffect(() => {
    const tick = () =>
      setMins(Math.max(0, Math.round((new Date(iso) - new Date()) / 60000)));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, [iso]);
  return (
    <div className="text-3xl font-semibold leading-none text-right">{mins}</div>
  );
}

function Row({ r }) {
  //console.log('row', r);
  const planned = useMemo(() => new Date(r.plannedTime), [r.plannedTime]);
  const realtime = useMemo(
    () => new Date(r.realTime || r.plannedTime),
    [r.realTime, r.plannedTime]
  );
  const delayMin = Math.round((realtime - planned) / 60000);
  const ontime = delayMin <= 0;
  const mins = Math.max(0, Math.round((realtime - new Date()) / 60000));

  const line = r.line?.name ?? r.line; // "8", "22", "N3"...
  const lineBg = {
    "8": "bg-[#95C11F]",
    "22": "bg-[#A69DCD]",
    "N3": "bg-[#E6007E]"
  };
  const badgeClass = `inline-flex items-center justify-center w-10 h-10 rounded-xl text-lg font-bold
                    ${lineBg[line] ?? "bg-[#9d9d9d]"} ${line === "22" ? "text-black" : "text-white"}`;

  return (
    <li className="flex items-center justify-between py-4 border-b">
      <div className="flex items-center gap-3">
        {r.icon && <img src={`https://bsag-netz.de${r.icon}`} alt={r.lineType} className="w-5 h-5 inline-block ml-2 align-[-2px]" />}
        <span className={badgeClass}>
          {r.line?.name ?? r.line}
        </span>
        <div>
          <div className="text-lg font-medium">{r.headsign ?? "-"}</div>
          <div className="text-sm text-gray-600">
            Planmäßig{" "}
            {planned.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            {delayMin !== 0 && (
              <span className={`ml-2 ${ontime ? "text-green-700" : "text-red-600 font-bold"}`}>
                {ontime ? "" : `+${delayMin} min`}
              </span>
            )}
            {r.cancelled && <span className="ml-2 text-red-600">fällt aus</span>}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-3xl font-semibold leading-none">
          {mins === 0 ? "Sofort" : mins}
        </div>
        <div className="text-sm text-gray-600">
          {mins === 0 ? "" : "min"}
        </div>
      </div>
    </li>
  );
}

export default function App() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const rsp = await fetch(`/api/bsag/departures?stopId=${STOP_ID}&limit=30`);
      if (!rsp.ok) throw new Error(await rsp.text());
      const data = await rsp.json();
      setRows(data.items ?? []);
      setErr("");
    } catch (e) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="bg-red-600 text-white p-4 shadow">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="rounded-full bg-white/10 px-3 py-1 text-sm">Haltestelle</div>
          <h1 className="text-2xl font-bold">Busestr.</h1>
        </div>
        <Clock />
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {err && <div className="p-3 bg-yellow-100 rounded-xl mb-3">{err}</div>}
        {loading && <div className="p-3">Ladataan…</div>}
        {(!loading && rows.length === 0) ? (
          <div className="p-3 text-center text-gray-500">Derzeit leider keine Fahrten</div>
        ) : (
          <ul>
            {rows.map((r, i) => <Row key={i} r={r} />)}
          </ul>
        )}      </main>
    </div>
  );
}
