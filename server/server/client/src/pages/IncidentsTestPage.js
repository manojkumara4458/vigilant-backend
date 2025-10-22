import React, { useEffect, useState } from "react";
import socket from "../socket"; // adjust path if your socket.js is elsewhere

function IncidentsTestPage() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    // Listen for new incident alerts
    socket.on("incident-alert", (incident) => {
      console.log("Received incident:", incident);
      setIncidents(prev => [incident, ...prev]); // Add new incident at the top
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("incident-alert");
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Real-Time Incidents</h1>
      {incidents.length === 0 ? (
        <p>No incidents yet...</p>
      ) : (
        <ul>
          {incidents.map((inc, idx) => (
            <li key={idx}>
              <strong>{inc.title || "Untitled Incident"}</strong>: {inc.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default IncidentsTestPage;
