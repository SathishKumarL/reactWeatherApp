import React, { useState, useEffect } from "react";

import Card from "../Card/Card";
import BarChart from "../BarChart/BarChart";
import { Radio } from "./Forecast.module.css";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";

const Forecast = () => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [items, setItems] = useState([]);
  const [selected, setSelected] = React.useState([]);
  let [unit, setUnit] = useState("imperial");// set the initial unit as imperial for API request
  let [loading, setLoading] = useState(false);
  let [latitude, setLatitude] = useState("");
  let [longitude, setLongitude] = useState("");
  let [days, setDays] = useState([]);
  let [chartData, setChartData] = useState([]);
  let [activeId, setActiveId] = useState(null);
  let [allDate, setAllDate] = useState([]);
//to get the location of access to pass it to API request
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
    apiCall();
  }, [unit, longitude]);
//Api request to fetch the 5 days record
  const apiCall = () => {
    if (latitude !== "") {
      setLoading(true);
      fetch(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=5eab201bc687d1a5b22c3ea45bcaa329&units=${unit}`,
        {}
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.cod !== "200") {
            throw new Error();
          }
          const locationVar = `${response.city.name}, ${response.city.country}`
          setCurrentLocation(locationVar);
          dataProcess(response);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };
//to process the response from API as per the business logic
  function dataProcess(response) {
    setLoading(false);
    var allDate = [];
    response.list.forEach(function (arrayItem) {
      arrayItem.dateArray = arrayItem.dt_txt.split(" ");
      if (allDate.indexOf(arrayItem.dateArray[0]) < 0) {
        allDate.push(arrayItem.dateArray[0]);
      }
    });
    setAllDate(allDate);//get all the dates from response
    var day = [];
    for (let i = 0; i < allDate.length; i++) {
      day[i] = [];
      for (var filter in response.list) {
        if (allDate[i] === response.list[filter].dateArray[0]) {
          day[i].push(response.list[filter]); // form a seperate array for each date to get the average and to render the bar chart
        }
      }
    }
    for (let j = 0; j < day.length; j++) {
      day[j][0].average =
        (day[j].reduce((total, next) => total + next.main.temp, 0) /
        day[j].length).toFixed(2);// getting the average of a day
    }
    const dateItem = () =>
      allDate.map((ind, index) => ({
        id: `${ind}`,
        average: day[index][0].average,
      }));
    setItems(dateItem);//for the data for the card carousel component
    setDays(()=>[...day]);
    
  }
//Api call trigger along with loading setState to load the screen
  function getForecast(e) {
    e.preventDefault();
    setLoading(true);
    apiCall();
  }
//Carousel arrow business logic to show and hide
  function Arrow({ children, disabled, onClick }) {
    return (
      <button
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }

  function LeftArrow() {
    const { isFirstItemVisible, scrollPrev } =
      React.useContext(VisibilityContext);

    return (
      <Arrow disabled={isFirstItemVisible} onClick={() => scrollPrev()}>
        Left
      </Arrow>
    );
  }

  function RightArrow() {
    const { isLastItemVisible, scrollNext } =
      React.useContext(VisibilityContext);

    return (
      <Arrow disabled={isLastItemVisible} onClick={() => scrollNext()}>
        Right
      </Arrow>
    );
  }
  const isItemSelected = (id) => !!selected.find((el) => el === id);
//business logic on click of card
  const handleItemClick =
    (itemId) =>
    ({ getItemById }) => {
      const itemSelected = isItemSelected(itemId);
      setActiveId(itemId);
      setSelected((currentSelected) =>
        itemSelected
          ? currentSelected.filter((el) => el !== itemId)
          : currentSelected.concat(itemId)
      );
      console.log('itemId');
      console.log(itemId);
      barChartData(allDate.indexOf(itemId));
    };
//to render the initial barchart on click of card
  function barChartData(i) {
    const chartData = () =>
      days[i].map((ind) => ({ time: ind.dateArray[1], temp: ind.main.temp }));
    setChartData(chartData);
  }
//to update barchart data on unit change 
  useEffect(() => {
    if(activeId !== null){
    var indexSelected=allDate.indexOf(activeId);
    const chartData = () =>
    days[indexSelected].map((ind) => ({ time: ind.dateArray[1], temp: ind.main.temp }));
  setChartData(chartData);
    }
  }, [days]);
//to get a fresh API on unit Select or location update
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
    apiCall();
  }, [unit, longitude]);

  return (
    <div>
      {loading && <div>loading</div>}
      {!loading && (
        <div>
          <header className="App-header">
            <h1>React Weather App</h1>
          </header>
          <h2>Weather Conditions of {currentLocation}</h2>
          <form onSubmit={getForecast}>
            <label className={Radio}>
              <input
                type="radio"
                name="units"
                checked={unit === "imperial"}
                value="imperial"
                onChange={(e) => setUnit(e.target.value)}
              />
              Fahrenheit
            </label>
            <label className={Radio}>
              <input
                type="radio"
                name="units"
                checked={unit === "metric"}
                value="metric"
                onChange={(e) => setUnit(e.target.value)}
              />
              Celcius
            </label>
          </form>
          <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
            {items.map(({ id, average }) => (
              <Card
                title={id}
                itemId={average} 
                key={id}
                activeId={activeId}
                onClick={handleItemClick(id)}
                selected={isItemSelected(id)}
                unit={unit}
              />
            ))}
          </ScrollMenu>

          {chartData.length > 0 && <BarChart chartData={chartData} />}
          <footer>
            Page created by Sathish
          </footer>
        </div>
      )}
    </div>
  );
};

export default Forecast;
