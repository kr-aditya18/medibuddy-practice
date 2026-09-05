import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import "../App.css";

function SearchPage() {
  const [query, setQuery] = useState(() => {
    return sessionStorage.getItem("lastQuery") || "";
  });

  const [medicines, setMedicines] = useState(() => {
    const saved = sessionStorage.getItem("lastResults");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  async function performSearch(searchTerm) {
    if (!searchTerm.trim()) {
      return;
    }

    setHasSearched(true);
    setLoading(true);
    setError("");

    try {
      const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(
        searchTerm
      )}"&limit=20`;

      const response = await fetch(url);

      if (response.status === 404) {
        setMedicines([]);
        sessionStorage.setItem("lastQuery", searchTerm);
        sessionStorage.setItem("lastResults", JSON.stringify([]));
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch medicines");
      }

      const data = await response.json();

      setMedicines(data.results || []);
      sessionStorage.setItem("lastQuery", searchTerm);
      sessionStorage.setItem(
        "lastResults",
        JSON.stringify(data.results || [])
      );
    } catch (error) {
      setError("Unable to fetch medicines. Please try again.");
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  function handleSearchClick() {
    performSearch(query);
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Medicine Search</h1>
        <p>Search medicines by brand name</p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter medicine name"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <button onClick={handleSearchClick}>Search</button>
      </div>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && hasSearched && medicines.length === 0 && (
        <p>No results found. Try a different medicine name.</p>
      )}

      <div className="medicine-grid">
        {medicines.map((medicine, index) => {
          const brandName =
            medicine.openfda?.brand_name?.[0] || "Unknown";

          const genericName =
            medicine.openfda?.generic_name?.[0] || "Not available";

          const manufacturer =
            medicine.openfda?.manufacturer_name?.[0] ||
            "Not available";

          const productType =
            medicine.openfda?.product_type?.[0] ||
            "Not available";

          return (
            <Link
              to={`/medicine/${medicine.id}`}
              key={index}
              className="medicine-card-link"
            >
              <div className="medicine-card">
                <h3>{brandName}</h3>
                <p>Generic: {genericName}</p>
                <p>Manufacturer: {manufacturer}</p>
                <p>Product Type: {productType}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SearchPage;