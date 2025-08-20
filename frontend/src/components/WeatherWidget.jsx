// src/WeatherWidget.jsx
import { useEffect, useState, useRef } from "react";

const WMO_ICON = (code) => {
  // Riittävän hyvä emoji-mäppäys WMO-koodeille
  if ([0].includes(code)) return "☀️";
  if ([1,2,3].includes(code)) return "⛅";
  if ([45,48].includes(code)) return "🌫️";
  if ([51,53,55,56,57].includes(code)) return "🌦️";
  if ([61,63,65,80,81,82].includes(code)) return "🌧️";
  if ([66,67].includes(code)) return "🌧️❄️";
  if ([71,73,75,85,86].includes(code)) return "🌨️";
  if ([95,96,99].includes(code)) return "⛈️";
  return "🌡️";
};

export default function WeatherWidget() {
  const [state, setState] = useState({
    ready: false,
    temp: null,
    code: null,
    wind: null,
    err: "",
  });
  const [locAllowed, setLocAllowed] = useState(false);
  const timer = useRef(null);
  const coordsRef = useRef(null);

  async function fetchWeather(lat, lon) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;
      const rsp = await fetch(url);
      if (!rsp.ok) throw new Error(`Weather ${rsp.status}`);
      const data = await rsp.json();
      const cur = data?.current;
      setState({
        ready: true,
        temp: typeof cur?.temperature_2m === "number" ? Math.round(cur.temperature_2m) : null,
        code: cur?.weather_code ?? null,
        wind: typeof cur?.wind_speed_10m === "number" ? Math.round(cur.wind_speed_10m) : null,
        err: "",
      });
    } catch (e) {
      setState((s) => ({ ...s, ready: false, err: String(e) }));
    }
  }

  function startPolling() {
    // päivitä 10 min välein
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      const c = coordsRef.current;
      if (c) fetchWeather(c.lat, c.lon);
    }, 10 * 60 * 1000);
  }

  async function enableLocation() {
    if (!("geolocation" in navigator)) {
      setState((s) => ({ ...s, err: "Sijaintipalvelu ei ole tuettu selaimessa." }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        coordsRef.current = { lat, lon };
        setLocAllowed(true);
        fetchWeather(lat, lon);
        startPolling();
      },
      (err) => {
        setState((s) => ({ ...s, err: err.message || "Sijainnin luku estetty." }));
        setLocAllowed(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 }
    );
  }

  // Kokeile kysyä luvan tila, jos selain tukee
  useEffect(() => {
    let canceled = false;
    (async () => {
      if (navigator.permissions?.query) {
        try {
          const p = await navigator.permissions.query({ name: "geolocation" });
          if (canceled) return;
          if (p.state === "granted") {
            enableLocation();
          }
          // 'prompt' tai 'denied' → näytetään nappi
        } catch {}
      }
    })();
    return () => {
      canceled = true;
      clearInterval(timer.current);
    };
  }, []);

  if (!locAllowed && !state.ready) {
    return (
      <button
        onClick={enableLocation}
        className="bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1 rounded-lg"
        title="Näytä paikallinen sää"
      >
        Näytä sää
      </button>
    );
  }

  if (state.err && !state.ready) {
    return <div className="text-xs text-white/80">Sää: {state.err}</div>;
  }

  return (
    <div className="flex items-center gap-2 text-white">
      <span className="text-xl" aria-hidden>{WMO_ICON(state.code)}</span>
      <span className="text-sm">
        {state.temp !== null ? `${state.temp}°C` : "--"}
        {state.wind !== null ? ` · ${state.wind} m/s` : ""}
      </span>
    </div>
  );
}
