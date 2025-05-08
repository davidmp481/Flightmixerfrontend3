import { useState } from "react";
import Select from "react-select";

export default function App() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [flexible, setFlexible] = useState(true);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOptions = async (inputValue) => {
    const res = await fetch(`https://flightmixer-backend.onrender.com/airports?q=${inputValue}`);
    const data = await res.json();
    return data;
  };

  const search = async () => {
    if (!origin || !destination) return;
    setLoading(true);
    const res = await fetch("https://flightmixer-backend.onrender.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin: origin.code,
        destination: destination.code,
        departure_date: departure,
        return_date: returnDate,
        flexible,
      }),
    });
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">FlightMixer</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Select
          placeholder="Origin"
          loadOptions={fetchOptions}
          defaultOptions
          onInputChange={(val) => val}
          onChange={setOrigin}
          getOptionLabel={(e) => e.label}
        />
        <Select
          placeholder="Destination"
          loadOptions={fetchOptions}
          defaultOptions
          onInputChange={(val) => val}
          onChange={setDestination}
          getOptionLabel={(e) => e.label}
        />
        <input className="p-2 border rounded" type="date" value={departure} onChange={(e) => setDeparture(e.target.value)} />
        <input className="p-2 border rounded" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
      </div>

      <label className="flex items-center space-x-2 mb-4">
        <input type="checkbox" checked={flexible} onChange={() => setFlexible(!flexible)} />
        <span>Flexible Dates (±3 days)</span>
      </label>

      <button
        onClick={search}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Searching..." : "Search Flights"}
      </button>

      <div className="mt-8 space-y-4">
        {results.map((item, idx) => (
          <div key={idx} className="p-4 border rounded shadow bg-white">
            <p className="font-bold text-lg text-green-700">Total Price: ${item.total_price}</p>
            <div className="mt-2">
              <h3 className="font-semibold">Outbound</h3>
              {item.outbound.map((leg, i) => (
                <p key={i}>✈ {leg.itineraries[0].segments[0].departure.iataCode} → {leg.itineraries[0].segments[0].arrival.iataCode}</p>
              ))}
              <h3 className="font-semibold mt-2">Return</h3>
              {item.return.map((leg, i) => (
                <p key={i}>✈ {leg.itineraries[0].segments[0].departure.iataCode} → {leg.itineraries[0].segments[0].arrival.iataCode}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
