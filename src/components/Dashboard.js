import React from "react";
import MapView from "./MapView";

import InfoButtonGroup from "./InfoButtons";
import {  Container, Grid, Card} from "@mui/material";

import WeatherMap from "./WeatherMap";
import AlertPie from "./AlertPie";

const Dashboard = () => {
  return (
    <div style={{ overflow: "hidden", marginTop: "-50px" }}>
    
      <Container
        maxWidth="lg"
        sx={{
          width: "100%",
          maxWidth: "1200px",
          margin: "50px auto",
          borderRadius: "10px",
          backgroundColor: "",
          padding: 5,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
       
        <Grid container rowSpacing={3} columnSpacing={2}>
        <Card  sx={{
          width: "100%",
          maxWidth: "1200px",
          margin: "50px auto",
          borderRadius: "10px",
          backgroundColor: "#2F2F2F",
          padding: 5,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}>
          <Grid item xs={12}>
            <InfoButtonGroup />
          </Grid>
          <Grid item xs={12}>
            <MapView  />
     
      
          </Grid>
          </Card>

          <Grid item xs={12} md={6}><AlertPie /></Grid>
          <Grid id="weather-map" item xs={12} md={6}><WeatherMap /></Grid>
        </Grid>
        
      </Container>
    </div>
  );
};

export default Dashboard;
