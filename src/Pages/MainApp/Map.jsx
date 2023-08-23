import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import { usePlaces } from "../../Contexts/PlacesProvider";
import { useGeolocation } from "../../hooks/useGeolocation";
import { useParamUrl } from "../../hooks/useParamUrl";

function Map() {
  const { data } = usePlaces();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();

  const [lat, lng] = useParamUrl();

  useEffect(
    function () {
      if (lat && lng) setMapPosition([lat, lng]);
    },
    [lat, lng]
  );

  useEffect(
    function () {
      if (geoLocationPosition) {
        setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
      }
    },
    [geoLocationPosition]
  );

  return (
    <div id="map">
      <MapContainer
        center={mapPosition}
        zoom={5}
        scrollWheelZoom={true}
        className={styles.map}
      >
        {!geoLocationPosition && (
          <button onClick={getPosition}>
            {isLoadingPosition ? "Loading..." : "Use your position"}
          </button>
        )}
        <TileLayer
          attribution='&copy; <a href="https://cartodb.com/attributions">CartoDB</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
          subdomains="abcd"
        />
        {data.map((places) => (
          <Marker
            position={[places.position.lat, places.position.lng]}
            key={places.id}
          >
            <Popup autoClose={false} closeOnClick={false}>
              <p>
                {places.emoji} {places.country}
              </p>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter mapPosition={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ mapPosition }) {
  const map = useMap();
  map.setView(mapPosition);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      console.log(e);
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;