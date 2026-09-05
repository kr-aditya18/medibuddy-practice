import { memo } from "react";
import { Link } from "react-router-dom";

function ResultsGrid({ medicines }) {
  return (
    <div className="medicine-grid">
      {medicines.map((medicine, index) => {
        const brandName = medicine.openfda?.brand_name?.[0] || "Unknown";
        const genericName =
          medicine.openfda?.generic_name?.[0] || "Not available";
        const manufacturer =
          medicine.openfda?.manufacturer_name?.[0] || "Not available";
        const productType = medicine.openfda?.product_type?.[0] || null;
        const route = medicine.openfda?.route?.[0] || null;

        return (
          <Link
            to={`/medicine/${medicine.id}`}
            key={medicine.id || index}
            className="medicine-card-link"
          >
            <div className="medicine-card">
              <h3>{brandName}</h3>

              <div className="tag-row">
                {productType && (
                  <span className="tag tag-red">{productType}</span>
                )}
                {route && <span className="tag tag-blue">{route}</span>}
              </div>

              <p>Generic: {genericName}</p>
              <p>Manufacturer: {manufacturer}</p>

              <div className="view-details">View Details</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default memo(ResultsGrid);