import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import axios from "axios";

export default function InfoButtonGroup() {
  const [cameras, setCameras] = useState([]);
  const [sites, setSites] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/cameras")
      .then((response) => {
        setCameras(response.data);
        setSites(response.data);
        setActiveAlerts(response.data.filter((camera) => camera.isActive).length);
      })
      .catch((error) => {
        console.error("Error fetching cameras:", error);
      });

  
  }, []);

  const buttonData = [
    { icon: <MapOutlinedIcon />, number: cameras.length-1, text: "Site" },
    { icon: <PhotoCameraOutlinedIcon />, number: cameras.length-1, text: "Camera" },
    { icon: <ReportProblemOutlinedIcon />, number: activeAlerts-1, text: "Active Alert" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
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
            textAlign: "left",
            minWidth: "150px",
            visibility: button.number === null ? "hidden" : "visible",
            color: "white", 
            borderColor: "white",
            "& svg": {
              color: button.text === "Active Alert" ? "red" : "white", 
            },
            "& .MuiButton-startIcon": {
              marginRight: 2,
            },
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {button.number !== null && button.text !== null && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  color: button.text === "Active Alert" ? "red" : "white", 
                  fontWeight: "bold",
                }}
              >
                {button.number}
              </span>
              <span
                style={{
                  color: "white",
                }}
              >
                {button.text}
              </span>
            </Box>
          )}
        </Button>
      ))}
    </Box>
  );
}
