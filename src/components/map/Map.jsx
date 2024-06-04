import { Map as MapboxMap, FullscreenControl, Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useEffect, useState } from "react";

const Map = ({ data }) => {
  const map = useRef();
  const mapboxApi = import.meta.env.VITE_MAPBOX_API_TOKEN;
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchMarkers = async () => {
      const markers = await Promise.all(
        data.map(async (mahasiswa) => {
          const address = `${mahasiswa.desa}, ${mahasiswa.kecamatan}, ${mahasiswa.kota}, ${mahasiswa.provinsi}`;
          try {
            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxApi}`);
            const data = await response.json();
            const features = data.features;
            console.log(data);
            if (features.length > 0) {
              const center = features[0].center;
              return {
                latitude: center[1],
                longitude: center[0],
                id: mahasiswa.id,
              };
            }
          } catch (error) {
            console.error("Error fetching geocoding data:", error);
          }
        })
      );
      setMarkers(markers.filter((marker) => marker)); // Filter out null or undefined markers
    };

    fetchMarkers();
  }, [data, mapboxApi]);

  return (
    <div>
      <MapboxMap
        ref={map}
        mapboxAccessToken={mapboxApi}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        initialViewState={{
          latitude: -8.098606,
          longitude: 112.183431,
          zoom: 11,
        }}
        style={{ width: "100%", height: 480, borderRadius: 10 }}
      >
        <Marker latitude={-8.098606} longitude={112.183431} />
        {markers.map((marker) => (
          <Marker key={marker.id} latitude={marker.latitude} longitude={marker.longitude} anchor="bottom" color="red" scale={0.8} />
        ))}
        <FullscreenControl />
        <NavigationControl />
      </MapboxMap>
    </div>
  );
};

export default Map;
