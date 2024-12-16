import React, { useState, useEffect } from "react";
import ResponsiveAppBar from "../../responsiveappbar/ResponsiveAppBar";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { Container, Typography } from "@mui/material";

const JigSaw = ({ activityId }) => {
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/activity/8`);
        setActivity(response.data);
      } catch (error) {
        console.error("Error al obtener la actividad:", error);
      }
    };

    fetchActivity();
  }, [activityId]);

  if (!activity) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <ResponsiveAppBar />
      <br />

      <Container sx={{ paddingTop: "5%", paddingBottom: "5%" }}>
        <Grid
          container
          style={{
            height: "95vh",
            paddingTop: "5%",
            paddingBottom: "5%",
            paddingLeft: "10%",
            paddingRight: "10%",
          }}
        >
          <div>
            <div className="flex items-center space-x-2">
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ color: "primary.main", textAlign: "center" }}
              >
                {activity.title}
              </Typography>
              {activity.objective && (
                <>
                  <h3>Objetivo</h3>
                  {activity.objective}
                </>
              )}
              {activity.metodology && (
                <>
                  <h3>Metodología</h3>
                  {activity.metodology}
                </>
              )}
              {activity.resources && (
                <>
                  <h3>Recursos</h3>
                  {activity.resources}
                </>
              )}
              {activity.introduction && (
                <>
                  <h3>Introducción</h3>
                  {activity.introduction}
                </>
              )}
              {activity.analisis && (
                <>
                  <h3>Análisis de la situación</h3>
                  {activity.analisis}
                </>
              )}
              {activity.evaluation && (
                <>
                  <h3>Evaluación de escenarios</h3>
                  {activity.evaluation}
                </>
              )}
              <br />
              <br />
              <br />
              <Link to={`/activity/jigsaw/teamselect`}>
                <Button size="small">Seleccionar equipo</Button>
              </Link>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>
          </div>
        </Grid>
      </Container>
      <br />
      <br />
    </>
  );
};

export default JigSaw;
