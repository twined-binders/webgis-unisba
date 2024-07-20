import { Map as MapboxMap, FullscreenControl, Marker, NavigationControl, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState, useRef } from "react";

const MapComponent = ({ data, selectedStudent, selectedResult }) => {
  const map = useRef();
  const mapboxApi = import.meta.env.VITE_MAPBOX_API_TOKEN;
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    const fetchMarkers = async () => {
      const markers = await Promise.all(
        data.map(async (mahasiswa) => {
          const address = `${mahasiswa.desa}, ${mahasiswa.kecamatan}, ${mahasiswa.kota}, ${mahasiswa.provinsi}`;
          try {
            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxApi}`);
            const data = await response.json();
            const features = data.features;

            if (features.length > 0) {
              const center = features[0].center;
              return {
                latitude: center[1],
                longitude: center[0],
                lokasi: mahasiswa.desa,
                id: mahasiswa.id,
                nama: mahasiswa.nama,
              };
            }
          } catch (error) {
            console.error("Error fetching geocoding data:", error);
          }
        })
      );

      const filteredMarkers = markers.filter((marker) => marker);

      const uniqueMarkersMap = new Map();
      filteredMarkers.forEach((marker) => {
        const key = `${marker.latitude},${marker.longitude}`;
        if (!uniqueMarkersMap.has(key)) {
          uniqueMarkersMap.set(key, { ...marker, students: [] });
        }
        uniqueMarkersMap.get(key).students.push({ id: marker.id, nama: marker.nama });
      });

      const uniqueMarkersList = Array.from(uniqueMarkersMap.values());

      setMarkers(uniqueMarkersList);
    };

    fetchMarkers();
  }, [data, mapboxApi]);

  useEffect(() => {
    if (selectedStudent) {
      const selectedMarker = markers.find((marker) => marker.students.some((student) => student.id === selectedStudent.id));
      setSelectedMarker(selectedMarker || null);
    } else {
      setSelectedMarker(null);
    }
  }, [selectedStudent, markers]);

  useEffect(() => {
    if (map.current && selectedMarker) {
      map.current.flyTo({
        center: [selectedMarker.longitude, selectedMarker.latitude],
        essential: true,
        zoom: 15,
        speed: 0.4,
        curve: 2,
      });
    }
  }, [selectedMarker]);

  useEffect(() => {
    if (map.current && selectedResult) {
      map.current.flyTo({
        center: [selectedResult.center[0], selectedResult.center[1]],
        essential: true,
        zoom: 15,
        speed: 0.4,
        curve: 2,
      });
    }
  }, [selectedResult]);

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
        <FullscreenControl />
        <NavigationControl />
        <Marker latitude={-8.098606} longitude={112.183431} />
        {markers.map((marker) => (
          <Marker
            key={`${marker.latitude}-${marker.longitude}`}
            latitude={marker.latitude}
            longitude={marker.longitude}
            anchor="bottom"
            color="red"
            scale={0.8}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedMarker(marker);
            }}
          />
        ))}
        {selectedMarker && (
          <Popup latitude={selectedMarker.latitude} longitude={selectedMarker.longitude} onClose={() => setSelectedMarker(null)} closeOnClick={false} anchor="top">
            <div>
              <div className="p-2">
                <h3 className="mb-2 text-xs font-medium text-slate-700">Mahasiswa di lokasi ini: {selectedMarker.lokasi}</h3>
                {selectedMarker.students.map((student, index) => (
                  <p className="text-xs" key={index}>
                    {student.nama}
                  </p>
                ))}
              </div>
            </div>
          </Popup>
        )}
        {selectedResult && (
          <Marker
            latitude={selectedResult.center[1]}
            longitude={selectedResult.center[0]}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedMarker({
                latitude: selectedResult.center[1],
                longitude: selectedResult.center[0],
                lokasi: selectedResult.place_name,
                students: [],
              });
            }}
          />
        )}
      </MapboxMap>
    </div>
  );
};

export default MapComponent;
