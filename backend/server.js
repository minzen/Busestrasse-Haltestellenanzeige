// server.js  (CommonJS)
const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/api/bsag/departures", async (req, res) => {
    const stopId = req.query.stopId || "9013799"; // Busestr. oletus
    const limit = req.query.limit || "300";
    const url = `https://bsag-netz.de/api/v1/stationboards/param_link/${encodeURIComponent(
        stopId
    )}?v=${Date.now()}&limit=${encodeURIComponent(limit)}`;

    try {
        console.log("[Proxy] ->", url);
        const r = await fetch(url, {
            headers: {
                Accept: "application/json",
                "User-Agent": "BusestrasseDisplay/1.0 (+local dev)"
            },
        });

        console.log("[Proxy] upstream status:", r.status);
        if (!r.ok) {
            const text = await r.text();
            console.error("[Proxy] upstream error body:", text);
            return res.status(502).json({ error: `Upstream ${r.status}`, body: text });
        }

        const data = await r.json();

        // Odotettu muoto: { data: [ ... ] }
        let listRaw = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : null;

        if (!Array.isArray(listRaw)) {
            const keys = data && typeof data === "object" ? Object.keys(data) : [];
            console.warn("[Proxy] Unexpected schema, keys:", keys);
            return res.json({
                stopId,
                fetchedAt: new Date().toISOString(),
                items: [],
                schema: keys,
                sample: JSON.stringify(data).slice(0, 800),
            });
        }

        const toIso = (sec) => (typeof sec === "number" ? new Date(sec * 1000).toISOString() : null);

        const list = listRaw.map((d) => {
            const plannedIso = toIso(d?.time ?? null);
            const realtimeIso = toIso(d?.realtime ?? null);

            return {
                line: d?.line?.name ?? null,           // <-- STRING frontille
                lineType: d?.line?.type ?? null,       // "Tram" | "Bus"
                icon: d?.line?.product_icon ?? null,   // esim. "/images/jpapi_hafas/tram.svg"
                headsign: d?.headsign ?? null,         // <-- STRING frontille
                plannedTime: plannedIso,               // ISO
                realTime: realtimeIso,             // ISO
                platform: d?.platform ?? null,
                cancelled: !!d?.cancelled,
                raw: d,
            };
        });

        res.json({ stopId, fetchedAt: new Date().toISOString(), items: list });
    } catch (e) {
        console.error("[Proxy] fetch failed:", e);
        res.status(502).json({ error: String(e) });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy listening at http://localhost:${PORT}`);
});
