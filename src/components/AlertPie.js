import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';
import DonutSmallOutlinedIcon from '@mui/icons-material/DonutSmallOutlined';
import Box from "@mui/material/Box";
import { Divider } from "@mui/material";
import "../style/AlertPie.css";

const AlertPie = () => {
    const data = [
        { value: 40, label: 'Safety Alert', color: '#8e24aa' },
        { value: 20, label: 'Intruder Alert', color: '#e53935' },
        { value: 15, label: 'Weather Alert', color: '#fbc02d' },
        { value: 25, label: 'Other Alert', color: '#ccc' },
    ];

    return (
        <Card sx={{ backgroundColor: '#2F2F2F', width: "100%", boxSizing: "border-box" }}>
            <CardHeader
                avatar={<DonutSmallOutlinedIcon />}
                title="Alert Distribution"
                sx={{ textAlign: 'left', color: "white" }}
            />
            <Divider sx={{ backgroundColor: 'grey', height: 1 }} />

            <CardActions disableSpacing>
                <Box sx={{ width: '100%', textAlign: 'center', position: 'relative' }}>
                    <PieChart
                        height={300}
                        series={[
                            {
                                data: data,
                                innerRadius: 50,
                                outerRadius: 80,
                            },
                        ]}
                        sx={{
                            '.MuiChartPie-sector': {
                                transition: 'fill 0.3s ease',
                            },
                        }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: 2, marginTop: -5 }}>
                        <Box sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                            {data.map((item, index) => (
                                <Typography
                                    key={index}
                                    variant="body2"
                                    sx={{ display: 'flex', alignItems: 'center', color: 'white' }}
                                >
                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            backgroundColor: item.color,
                                            marginRight: 1,
                                        }}
                                    />
                                    {item.label}: {item.value}%
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </CardActions>
        </Card>
    );
};

export default AlertPie;
