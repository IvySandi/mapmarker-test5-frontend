import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import AirOutlinedIcon from '@mui/icons-material/AirOutlined';
import Box from "@mui/material/Box";
import WeatherImage from "../assets/images/weather-map.png";
import { Divider } from "@mui/material";

const initialButtonData = [
  { icon: <DeviceThermostatOutlinedIcon />, text: "Temperature" },
  { icon: <AirOutlinedIcon />, text: "Wind Speed" },
  { icon: <CloudOutlinedIcon />, text: "Cloud Coverage" }
];

const WeatherMap = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [buttonData, setButtonData] = useState(initialButtonData);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("Singapore");
  const API_KEY = "98ad4dbc3fa5e62a64649bf0318d2858"; // OpenWeatherMap API key

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
      .then((response) => {
        setWeatherData(response.data);
        updateButtonData(response.data);
      })
      .catch((error) => {
        setError("Failed to fetch weather data.");
        console.error(error);
      });
  }, [city]);

  // Update button data based on weather data
  const updateButtonData = (data) => {
    const updatedData = [...initialButtonData];
    updatedData[0].number = (data.main.temp - 273.15).toFixed(2); 
    updatedData[1].number = data.wind.speed; 
    updatedData[2].number = data.clouds.all; 
    setButtonData(updatedData);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
  
    <Card  id="weather-map" sx={{ backgroundColor: '#2F2F2F', }}>
      <CardHeader  
        avatar={<WbSunnyOutlinedIcon />}
        title={
          weatherData ? weatherData.name + " Weather Data" : "Loading..."
        }
        subheader={
          weatherData ? (
            <Box sx={{ display: 'inline', color: 'white' }}>
              September 14, 2016
            </Box>
          ) : null
        }
        sx={{ textAlign: 'left', color: "white" }}
      />
       <Divider sx={{ backgroundColor: 'grey', height: 1 }}/>
      <CardMedia 
        component="img"
        height="194"
        image={WeatherImage}
        alt="Weather Image"
        sx={{ padding: "5px" }} 
      
      />
      <CardActions disableSpacing>
        <Box style={{margin:"17px"}}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center", 
            gap: 2,
            width: "100%",
          }}
        >
          {buttonData.map((button, index) => (
            <Button
              key={index}
              variant="outlined"
              startIcon={button.icon}
              sx={{
                flex: "1 1 calc(20% - 16px)",
                minWidth: "150px",
                cursor: "auto",
                color: "white",
                borderColor: "white",
                textTransform: "capitalize",
                "& svg": {
                  color: "white",
                },
                "& .MuiButton-startIcon": {
                  marginRight: 2,
                },
                display: "flex",
                flexDirection: "row", 
                justifyContent: "center", 
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {button.number !== null && button.text !== null && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span>{button.text}</span>
                  <span>{button.number}</span>
                </Box>
              )}
            </Button>
          ))}
        </Box>
      </CardActions>
    </Card>
 
  );
};

export default WeatherMap;
