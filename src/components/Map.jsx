/* eslint-disable react/no-unescaped-entities */
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// eslint-disable-next-line react/prop-types
const Map = (prop) => {
  let latitudeLongitude = prop.position.split(",");
  let lat = parseFloat(latitudeLongitude[0]);
  let lng = parseFloat(latitudeLongitude[1]);
  const icon = new Icon({
    iconUrl:
      "https://as1.ftcdn.net/v2/jpg/07/00/28/16/1000_F_700281654_r9dsHGGMdHRuqshtB5DQ4qOSzQzOamqW.webp",
    iconSize: [30, 30],
  });
  const icon2 = new Icon({
    iconUrl:
      "https://cdn1.iconfinder.com/data/icons/basic-ui-elements-coloricon/21/06_1-512.png",
    iconSize: [30, 30],
  });

  return (
    <>
      <div className="w-[100%] h-[350px]">
        <MapContainer
          center={[lat, lng]}
          zoom={11}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} icon={icon}>
            <Popup>
              <h3>hello I'm client</h3>
            </Popup>
          </Marker>
          <Marker position={[41.267193, 69.226858]} icon={icon2}>
            <Popup>
              <h3>Yakkasaroy</h3>
            </Popup>
          </Marker>
          <Marker position={[41.350852, 69.244140]} icon={icon2}>
            <Popup>
              <h3>Olmazor</h3>
            </Popup>
          </Marker>
          <Marker position={[41.318682, 69.339927]} icon={icon2}>
            <Popup>
              <h3>Buyuk ipak yo'li</h3>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </>
  );
};

export default Map;
