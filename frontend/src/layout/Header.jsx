import StopPicker from "../components/StopPicker";
import WeatherWidget from "../components/WeatherWidget";
import Clock from "../components/Clock";

export default function Header({ stopId, onStopChange, stops = [] }) {
    const currentStopLabel =
        stops.find((s) => s.id === stopId)?.label || "Haltestelle";

    return (
        <header className="bg-red-600 text-white p-3 sm:p-4 shadow">
            <div className="max-w-4xl mx-auto">
                {/* Rivi 1: pysäkin nimi yksin */}
                <h1 className="text-xl sm:text-2xl font-bold leading-tight truncate">
                    Abfahrten ({currentStopLabel})
                </h1>

                {/* Rivi 2: valitsin + sää + kello, wrap tarvittaessa */}
                <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-4">
                    {/* StopPicker vasemmalle */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="stop-select" className="text-xs sm:text-sm opacity-90">
                            Haltestelle auswählen
                        </label>
                        <StopPicker
                            id="stop-select"
                            value={stopId}
                            onChange={onStopChange}
                            stops={stops}
                        />
                    </div>
                    {/* oikea puoli: sää + kello; siirtyy seuraavalle riville jos tila loppuu */}
                    <div className="ml-auto flex flex-wrap items-center gap-2 sm:gap-4">
                        {/* Sää: mobiilissa compact */}
                        <span className="inline sm:hidden">
                            <WeatherWidget compact />
                        </span>
                        <span className="hidden sm:inline">
                            <WeatherWidget />
                        </span>

                        {/* Kello: mobiilissa aika, md+: päivämäärä + aika */}
                        <div className="text-right font-mono">
                            <Clock format="HH:mm" className="text-base sm:text-lg md:hidden" />
                            <Clock
                                format="dd.MM.yyyy HH:mm"
                                className="hidden md:block text-lg"
                            />
                        </div>
</div>
                    </div>
                </div>
        </header>
    );
}
