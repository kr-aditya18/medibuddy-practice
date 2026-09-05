import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(
        query
      )}"&limit=20`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch medicines");
      }

      const data = await response.json();

      setMedicines(data.results || []);
    } catch (error) {
      setError("Unable to fetch medicines. Please try again.");
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Medicine Search</h1>
      <p>Search medicines by brand name</p>

      <input
        type="text"
        placeholder="Enter medicine name"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {medicines.map((medicine, index) => (
        <div key={index}>
          <h3>{medicine.openfda?.brand_name?.[0]}</h3>
        </div>
      ))}
    </div>
  );
}

export default App;