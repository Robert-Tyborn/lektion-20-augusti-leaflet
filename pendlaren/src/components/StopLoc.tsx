import './StopLoc.css';
import { StopLocation } from '../interfaces';
import { useState } from 'react';

interface StopLocProps {
  stop: StopLocation;
}

function StopLoc(props: StopLocProps) {
  const { stop } = props;
  const [departures, setDepartures] = useState([]);

  async function getTimetable() { 
    const response =
      await fetch(`https://api.resrobot.se/v2.1/departureBoard?id=${
        stop.extId
      }&maxJourneys=20&format=json&accessId=${import.meta.env.VITE_API_KEY}
`);
    const { Departure } = await response.json();
    console.log(Departure);

    setDepartures(Departure);
  }

  const departuresComp = departures.map((departure) => {
    return (
      <p>
        {departure.name} - {departure.direction} - {departure.time}
      </p>
    );
  });

  return (
    <article>
      <h3 onClick={getTimetable}>{stop.name}</h3>
      {departuresComp}
    </article>
  );
}

export default StopLoc;
