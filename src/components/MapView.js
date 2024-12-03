import React, { useEffect, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import axios from "axios";
import { Card, CardContent, Button, Typography, CardMedia } from "@mui/material";
import Overlay from "ol/Overlay";
import "../style/MapView.css";
import cameraIcon from "../assets/images/camera-icon.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import SearchBar from "./SearchField";

const MapView = () => {
    const [cameras, setCameras] = useState([]);
    const [selectedCameras, setSelectedCameras] = useState([]);
    const [activeAlert, setActiveAlert] = useState();
    const [filteredCameras, setFilteredCameras] = useState([]);
    const [showCard, setShowCard] = useState(false);
    
    useEffect(() => {
        axios
        .get("http://localhost:5000/api/cameras")
        .then((response) => {
            setCameras(response.data);
            setFilteredCameras(response.data);
        })
        .catch((error) => {
            console.error("Error fetching cameras:", error);
        });
    }, []);
    
    useEffect(() => {
        if (cameras.length === 0) return;
    
        const map = new Map({
            target: "map",
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: fromLonLat([103.8198, 1.3521]),
                zoom: 12,
            }),
        });
    
        const overlays = [];
    
        filteredCameras.forEach((camera) => {
            const cameraElement = document.createElement("div");
            cameraElement.className = "camera-icon"; 
    
  
            if (camera.isActive) {
                cameraElement.style.backgroundColor = "red"; 
            } else {
                cameraElement.style.backgroundColor = "black"; 
            }
    
           
            if (selectedCameras.some((selected) => selected.id === camera.id)) {
                if (activeAlert) {
                    cameraElement.style.backgroundColor = "red"; 
                } else {
                    cameraElement.style.backgroundColor = "purple"; 
                }
            }
    
            const cameraImage = document.createElement("img");
            cameraImage.src = cameraIcon;
            cameraElement.appendChild(cameraImage);
    
            const cameraOverlay = new Overlay({
                element: cameraElement,
                positioning: "center-center",
                stopEvent: false,
            });
    
            cameraOverlay.setPosition(fromLonLat([camera.longitude, camera.latitude]));
            map.addOverlay(cameraOverlay);
            overlays.push(cameraOverlay);
    
            
            cameraElement.addEventListener("click", () => {
                setSelectedCameras((prevSelected) => {
                    const alreadySelected = prevSelected.some((selected) => selected.id === camera.id);
                    return alreadySelected
                        ? prevSelected.filter((selected) => selected.id !== camera.id)
                        : [...prevSelected, camera];
                });
            });
        });
    
        return () => {
            overlays.forEach((overlay) => map.removeOverlay(overlay));
            map.setTarget(null);
        };
    }, [filteredCameras, selectedCameras, activeAlert]);
    
    
    
 
    useEffect(() => {
        setShowCard(selectedCameras.length > 0);
    }, [selectedCameras]);
    
    const toggleActiveAlert = async () => {
        if (selectedCameras.length === 0) {
            alert("No camera selected!");
            return;
        }
    
        const lastSelectedCamera = selectedCameras[selectedCameras.length - 1];
        try {
            const response = await axios.post("http://localhost:5000/api/cameras/activetrigger", {
                id: lastSelectedCamera.id,
            });
    
            if (response.status === 200) {
                const updatedCamera = response.data;
    
                setCameras((prevCameras) =>
                    prevCameras.map((camera) =>
                        camera.id === updatedCamera.id ? updatedCamera : camera
                    )
                );
    
                setSelectedCameras((prevSelected) =>
                    prevSelected.map((camera) =>
                        camera.id === updatedCamera.id ? updatedCamera : camera
                    )
                );
    
                setActiveAlert(updatedCamera.isActive);  
            }
        } catch (error) {
            console.error("Error toggling camera active state:", error);
        }
    };
    
    
const handleFilteredCameras = (filtered) => {
    setFilteredCameras(filtered);
};

const resetState = () => {
    // setSelectedCameras([]);
    setFilteredCameras(cameras);
    setShowCard(false);
};
const handleCreateGroup = async () => {
    if (selectedCameras.length === 0) {
      alert("Please select at least one camera.");
      return;
    }
  
   
    const groupName = prompt("Enter the group name:");
  
    if (!groupName) {
      alert("Group name is required.");
      return;
    }
  

    const cameraIds = selectedCameras.map((camera) => camera.id);
  
    try {
      const response = await axios.post("http://localhost:5000/api/groups", {
        name: groupName,
        cameraIds: cameraIds,
      });
  
      if (response.status === 201) {
        alert("Group created successfully!");
        console.log("Created group:", response.data);
        
      }
    } catch (error) {
      console.error("Error creating group:", error);
      alert("An error occurred while creating the group.");
    }
  };
  

return (
    <div style={{ position: "relative" }}>
    <SearchBar onFilteredCameras={handleFilteredCameras} />
    
    <div
    id="map"
    style={{
        height: "500px",
        width: "100%",
    }}
    ></div>
    
    {showCard && (
        <Card
        sx={{
            position: "absolute",
            bottom: "0px",
            right: "0px",
            backgroundColor: "transparent",
            boxShadow: "none",
            padding: "10px",
            width: "30%",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            margin: "20px",
            "@media (max-width: 768px)": {
                width: "70%",
            },
            "@media (max-width: 480px)": {
                width: "90%",
            },
        }}
        >
        <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: "10px",
        }}
        >
        <Button
        variant="contained"
        sx={{
            backgroundColor: "#222",
            color: "white",
            textTransform: "capitalize",
            "&:hover": { backgroundColor: "#444" },
            width: "48%",
        }}
        onClick={handleCreateGroup}
        >
        Create Group
        </Button>
        <Button
        variant="contained"
        sx={{
            backgroundColor: "#222",
            color: "white",
            textTransform: "capitalize",
            "&:hover": { backgroundColor: "#444" },
            width: "48%",
        }}
        onClick={resetState}
        >
        View Feed
        <ArrowForwardIcon sx={{ marginLeft: "5px" }} />
        </Button>
        </div>
        
        <CardContent
        sx={{
            backgroundColor: "#222",
            color: "white",
            borderRadius: "5px",
        }}
        >
        <Typography variant="h6" color="white">
        {selectedCameras.length} Camera
        {selectedCameras.length > 1 ? "s" : ""} Selected
        </Typography>
        <Typography variant="body2" color="white">
        {selectedCameras
            .map((camera) => `${camera.name} (${camera.department})`)
            .join(", ")}
            </Typography>
            
            <Button
    variant="contained"
    sx={{
        backgroundColor: "#d32f2f",
        color: "white",
        textTransform: "uppercase",
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        "&:hover": { backgroundColor: "#b71c1c" },
    }}
    onClick={toggleActiveAlert}
>
    <ReportProblemOutlinedIcon />
    {selectedCameras.some(camera => camera.isActive) ? "Disable Alert" : "Enable Alert"}
</Button>

            
            
            {selectedCameras.length > 0 && (
                <CardMedia
                component="img"
                height="150"
                image={selectedCameras[selectedCameras.length - 1]?.image || ""}
                alt={selectedCameras[selectedCameras.length - 1]?.name || "Camera Image"}
                sx={{
                    margin: "5px 0",
                    objectFit: "contain",
                    borderRadius: "8px",
                }}
                />
            )}
            </CardContent>
            </Card>
        )}
        </div>
    );
};

export default MapView;
