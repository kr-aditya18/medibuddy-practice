import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function DetailPage() {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMedicine() {
      setLoading(true);
      setError("");

      try {
        const url = `https://api.fda.gov/drug/label.json?search=id:"${id}"&limit=1`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch medicine");
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
          setMedicine(data.results[0]);
        } else {
          setMedicine(null);
        }
      } catch (err) {
        setError("Could not load this medicine. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchMedicine();
  }, [id]);

  if (loading) {
    return <p style={{ padding: "40px" }}>Loading...</p>;
  }

  if (error) {
    return <p style={{ padding: "40px" }}>{error}</p>;
  }

  if (!medicine) {
    return (
      <div style={{ padding: "40px" }}>
        <p>Medicine not found.</p>
        <Link to="/">Back to search</Link>
      </div>
    );
  }

  const brandName = medicine.openfda?.brand_name?.[0] || "Unknown";
  const genericName = medicine.openfda?.generic_name?.[0] || "Not available";
  const manufacturer = medicine.openfda?.manufacturer_name?.[0] || "Not available";
  const productType = medicine.openfda?.product_type?.[0] || "Not available";
  const route = medicine.openfda?.route?.[0] || "Not available";
  const substance = medicine.openfda?.substance_name?.[0] || "Not available";

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <Link to="/">&larr; Back to search</Link>
      <h1>{brandName}</h1>
      <p>Generic name: {genericName}</p>
      <p>Manufacturer: {manufacturer}</p>
      <p>Product type: {productType}</p>
      <p>Route: {route}</p>
      <p>Active substance: {substance}</p>
    </div>
  );
}

export default DetailPage;