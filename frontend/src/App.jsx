import { useEffect, useRef, useState, useMemo } from "react";
import StopPicker from "./components/StopPicker";
import Clock from "./components/Clock";
import WeatherWidget from "./components/WeatherWidget";

const STOPS = [
  { id: "9013799", label: "Busestraße" },
  { id: "9013703", label: "Am Stern" },
  { id: "9013768", label: "Hauptbahnhof-Nord/Messe" },
  { id: "9013779", label: "Brahmsstraße" },
  { id: "9013791", label: "Bulthauptstr." },
  { id: "9013814", label: "Crüsemannallee" },
  { id: "9014022", label: "Kulenkampffallee" },
  { id: "9013804", label: "Bürgerpark" },
  { id: "9014123", label: "Parkallee" },
  { id: "9014082", label: "Munte" },
  { id: "9014148", label: "Riensberg" },
  { id: "9014306", label: "Wätjenstraße" },
  { id: "9013847", label: "Emmastraße" },
  { id: "9013909", label: "H.-H.-Meier-Allee" },
  { id: "9013987", label: "Joseph-Haydn-Str." },
  { id: "9013803", label: "Bürgermeister-Spitta-Allee" },
  { id: "9013866", label: "Focke-Museum" },
  { id: "9013873", label: "Friedhofstr." },
  { id: "9014001", label: "Kirchbachstr." },
  { id: "9014072", label: "Metzer Str." },
  { id: "9014200", label: "St.-Joseph-Stift" },
  { id: "9013964", label: "Hollerallee" },
  { id: "9014124", label: "Parkstr." },
  { id: "9014253", label: "Verdunstr." },
  { id: "9013715", label: "Arensburgstr." },
  { id: "9013876", label: "Friedrich-Mißler-Str." },
  { id: "9013729", label: "August-Bebel-Allee" },
  { id: "9014043", label: "Loignystr." },
];

// Sort the array by the label
STOPS.sort(function (a, b) {
  const textA = a.label.toUpperCase();
  const textB = b.label.toUpperCase();
  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
});

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
    "1": "bg-[#009640]",
    "1E": "bg-[#009640]",
    "2": "bg-[#005ca9]",
    "3": "bg-[#009fe3]",
    "4": "bg-[#e30613]",
    "5": "bg-[#009db1]",
    "6": "bg-[#ffcc00]",// musta fontti
    "6E": "bg-[#ffcc00]",// musta fontti
    "8": "bg-[#95C11F]",
    "10": "bg-[#312783]",
    "14": "bg-[#95C11F]",
    "20": "bg-[#95C11F]",
    "21": "bg-[#009fe3]",
    "22": "bg-[#A69DCD]",
    "22E": "bg-[#A69DCD]",
    "23": "bg-[#005ca9]",
    "24": "bg-[#951b81]",
    "25": "bg-[#009640]",
    "26": "bg-[#e30613]",
    "27": "bg-[#ef7d00]",
    "28": "bg-[#ffcc00]",// musta fontti
    "29": "bg-[#95C11F]",
    "31": "bg-[#95C11F]",
    "33": "bg-[#ffcc00]",// musta fontti
    "34": "bg-[#ffcc00]",// musta fontti
    "37": "bg-[#951b81]",
    "38": "bg-[#ffcc00]",// musta fontti
    "39": "bg-[#ffcc00]",// musta fontti
    "40": "bg-[#e30613]",
    "41": "bg-[#e30613]",
    "44": "bg-[#ef7d00]",
    "52": "bg-[#95C11F]",
    "55": "bg-[#ffcc00]",// musta fontti
    "57": "bg-[#ef7d00]",
    "58": "bg-[#ef7d00]",
    "61": "bg-[#009fe3]",
    "62": "bg-[#009640]",
    "63": "bg-[#312783]",
    "65": "bg-[#95C11F]",
    "66": "bg-[#95C11F]",
    "67": "bg-[#ffcc00]",// musta fontti
    "80": "bg-[#95C11F]",
    "81": "bg-[#009640]",
    "82": "bg-[#ef7d00]",
    "90": "bg-[#312783]",
    "93": "bg-[#ffcc00]",// musta fontti
    "94": "bg-[#e30613]",
    "95": "bg-[#ef7d00]",
    "96": "bg-[#951b81]",
    "98": "bg-[#009640]",
    "N1": "bg-[#009640]",
    "N3": "bg-[#E6007E]",
    "N4": "bg-[#e30613]",
    "N5": "bg-[#ef7d00]",
    "N6": "bg-[#009fe3]",
    "N7": "bg-[#95C11F]",
    "N9": "bg-[#ffcc00]",// musta fontti
    "N10": "bg-[#009fe3]",
    "N94": "bg-[#A69DCD]",

  };
  const badgeClass = `inline-flex items-center justify-center w-10 h-10 rounded-xl text-lg font-bold
                    ${lineBg[line] ?? "bg-[#9d9d9d]"} ${line === "6" || line === "6E" || line === "28" || line === "33" || line === "34" || line === "38" || line === "39" || line === "55" || line === "67" || line === "93" || line === "N9" ? "text-black" : "text-white"}`;

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
  const defaultStop = localStorage.getItem("stopId") || STOPS[0].id;
  const [stopId, setStopId] = useState(defaultStop);
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const pollRef = useRef(null);

  async function load(currentStopId = stopId) {
    try {
      const rsp = await fetch(`/api/bsag/departures?stopId=${currentStopId}&limit=30`);
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

  // Käynnistä pollaus
  useEffect(() => {
    // ensimmäinen haku heti
    load(stopId);
    // 15 s välein
    pollRef.current = setInterval(() => load(stopId), 15000);
    return () => clearInterval(pollRef.current);
    // HUOM: riippuvuutena stopId, jotta interval nollautuu pysäkin vaihtuessa
  }, [stopId]);

  // Kun käyttäjä vaihtaa pysäkin
  function handleStopChange(newId) {
    setStopId(newId);
    localStorage.setItem("stopId", newId);
    setLoading(true);
    // tee välitön haku uuteen pysäkkiin
    load(newId);
    // interval nollautuu useEffectissä
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="bg-red-600 text-white p-4 shadow">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
        </div>
        <div className="flex items-center gap-6">
          <StopPicker value={stopId} onChange={handleStopChange} stops={STOPS} />
          <WeatherWidget />
          <Clock />
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {err && <div className="p-3 bg-yellow-100 rounded-xl mb-3">{err}</div>}
        {loading && <div className="p-3">Lädt...</div>}
        {(!loading && rows.length === 0) ? (
          <div className="p-3 text-center text-gray-500">Derzeit leider keine Fahrten. Für die Nachtlinien bitte den Fahrplan prüfen!</div>
        ) : (
          <>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                Abfahrt in
              </div>
            </div>
            <ul>
              {rows
                .slice() // kopio ettei mutatoida alkuperäistä
                .sort((a, b) => {
                  const ta = new Date(a.realTime || a.plannedTime);
                  const tb = new Date(b.realTime || b.plannedTime);
                  return ta - tb;
                })
                .map((r, i) => <Row key={i} r={r} />)}            </ul>
          </>
        )}      </main>
    </div>
  );
}
