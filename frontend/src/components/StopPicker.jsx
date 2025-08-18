// StopPicker.jsx
import { useEffect, useState } from "react";

export default function StopPicker({ value, onChange, stops }) {
    const [sel, setSel] = useState(value);

    useEffect(() => setSel(value), [value]);

    return (
        <div className="flex items-center gap-2">
            <label className="text-sm text-white/90">Haltestelle</label>
            <select
                className="bg-white text-gray-900 rounded-lg px-2 py-1 text-sm"
                value={sel}
                onChange={(e) => {
                    setSel(e.target.value);
                    onChange(e.target.value);
                }}
            >
                {stops.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                ))}
            </select>
        </div>
    );
}
