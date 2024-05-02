import { useEffect } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";

const Search = () => {
  let lat = "41.30706166161981";
  let lng = "69.30683489432448";

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchAddress = async () => {
      try {
        const results = await provider.search({ query: `${lat},${lng}` });
        if (results.length) {
          console.log(`Адрес: ${results[0].label}`);
        }
      } catch (error) {
        console.error("Error searching address:", error);
      }
    };

    searchAddress();
  }, [lat, lng]);

  return null; // Return null since no UI component is rendered
};

export default Search;
