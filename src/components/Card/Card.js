import React from "react";
import { VisibilityContext } from "react-horizontal-scrolling-menu";
import weatherIcon from "../Logo/weather-forecast-icon.jpg"

export default function Card({ title, itemId, selected, activeId, onClick,unit }) {
  const visibility = React.useContext(VisibilityContext);
  
  return (
    <div
      onClick={() => onClick(visibility)}
      className={`cardBox ${activeId === title && "is-active"}`}
      
      tabIndex={0}
    >
      <div className="card">
        <div className="cardTitle">{title}</div>
        <img src={weatherIcon} className="cardIcon"/>
        <div className="temp">{itemId} °{unit === 'imperial' ? 'F' : 'C'}</div>
      </div>
      
    </div>
  );
}
