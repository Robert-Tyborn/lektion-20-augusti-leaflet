import { useState, useEffect } from 'react';

import './App.css';

import StopLoc from './components/StopLoc';

import { Stop } from './interfaces';

function App() {
  const [position, setPosition] = useState<GeolocationCoordinates>();
  const [stopLocations, setStopLocations] = useState<Stop[]>([]);

  function getPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition(position.coords);
      });
    }
  }

  async function getNearbyStops() {
    const response = await fetch(
      `https://api.resrobot.se/v2.1/location.nearbystops?originCoordLat=${
        position?.latitude
      }&originCoordLong=${position?.longitude}&format=json&accessId=${
        import.meta.env.VITE_API_KEY
      }`
    );
    const { stopLocationOrCoordLocation } = await response.json();
    setStopLocations(stopLocationOrCoordLocation);
  }

  useEffect(() => {
    if (position?.latitude) {
      getNearbyStops();
    }
  }, [position]);

  const stopLocationComps = stopLocations.map((stop) => {
    const { StopLocation } = stop;
    return <StopLoc stop={StopLocation} key={StopLocation.extId} />;
  });

  return (
    <main>
      <button onClick={getPosition}>Hämta position</button>
      <section>{stopLocationComps}</section>
    </main>
  );
}

export default App;
