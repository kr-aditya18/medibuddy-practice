import { useState, useEffect, useRef } from "react";
import useDebounce from "../hooks/useDebounce";
import ResultsGrid from "../components/ResultsGrid";
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
  const cache = useRef({});
  const abortRef = useRef(null);

  async function performSearch(searchTerm) {
    if (!searchTerm.trim()) {
      return;
    }

    setHasSearched(true);
    setError("");

    const cacheKey = searchTerm.trim().toLowerCase();

    if (cache.current[cacheKey]) {
      setMedicines(cache.current[cacheKey]);
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);

    try {
      const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(
        searchTerm
      )}"&limit=20`;

      const response = await fetch(url, { signal: controller.signal });

      if (response.status === 404) {
        setMedicines([]);
        cache.current[cacheKey] = [];
        sessionStorage.setItem("lastQuery", searchTerm);
        sessionStorage.setItem("lastResults", JSON.stringify([]));
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch medicines");
      }

      const data = await response.json();

      setMedicines(data.results || []);
      cache.current[cacheKey] = data.results || [];
      sessionStorage.setItem("lastQuery", searchTerm);
      sessionStorage.setItem(
        "lastResults",
        JSON.stringify(data.results || [])
      );
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
      setError("Unable to fetch medicines. Please try again.");
      setMedicines([]);
    } finally {
      if (abortRef.current === controller) {
        setLoading(false);
      }
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

      {loading && <p className="status-text">Loading...</p>}

      {error && <p className="status-text">{error}</p>}

      {!loading && !error && hasSearched && medicines.length === 0 && (
        <p className="status-text">
          No results found. Try a different medicine name.
        </p>
      )}

      {!loading && medicines.length > 0 && (
        <div className="results-header">
          <h2>Results for "{query}"</h2>
          <span className="results-count">
            {medicines.length} formulations found
          </span>
        </div>
      )}

      <ResultsGrid medicines={medicines} />
    </div>
  );
}

export default SearchPage;