import React, { useState, useEffect } from "react";
import ResponsiveAppBar from "../../responsiveappbar/ResponsiveAppBar";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Container, Typography } from "@mui/material";

export default function MentalMap() {
  const [activity, setActivity] = useState(null);
  const [decision, setDecision] = useState(null);
  const [response, setResponse] = useState(null);
  const { user } = useAuth0();

  const [justification, setJustification] = useState("");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/activity/9`)
      .then((response) => {
        setActivity(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los detalles de la actividad:", error);
      }, []);

    axios
      .get("http://127.0.0.1:8000/decision/random/")
      .then((response) => {
        setDecision(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las decisiones:", error);
      });
  }, []);

  const handleResponse = (response) => {
    setResponse(response);
  };

  const handleJustificationChange = (event) => {
    setJustification(event.target.value);
  };

  const handleSubmit = () => {
    const data = {
      user_email: user.email,
      activity_id: "9",
      question_number: decision.id,
      answer_text: response + " - " + justification,
      rating: -1,
      comment: "",
    };

    axios
      .post("http://127.0.0.1:8000/answer", data)
      .then((response) => {
        console.log("Respuesta guardada:", response.data);
        alert(`Respuesta Enviada.`);
      })
      .catch((error) => {
        console.error("Error al guardar la respuesta:", error);
      }, []);
  };

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
              <h3>Objetivo</h3>
              {activity.objective}
              <h3>Metodología</h3>
              {activity.metodology}
              <h3>Recursos</h3>
              {activity.resources}
              <h3>Introducción</h3>
              {activity.introduction}
              <br />
              <br />
              <br />
              <div
                style={{
                  textAlign: "center",
                  backgroundColor: "#f0f8ff",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                {decision ? (
                  <div>
                    <h1
                      style={{
                        color: "#ff4500",
                        fontSize: "30px",
                        marginBottom: "10px",
                      }}
                    >
                      ¿Te pondrías en esta situación?
                    </h1>
                    {decision.option1}
                    <h2
                      style={{
                        color: "#ff4500",
                        fontSize: "30px",
                        marginTop: "10px",
                      }}
                    >
                      pero
                    </h2>
                    {decision.option2}
                  </div>
                ) : (
                  <div>Cargando decisiones...</div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <div style={{ marginRight: "20px" }}>
                  <img
                    src="https://cdn.pixabay.com/photo/2016/06/01/16/40/thumb-1429327_1280.png"
                    alt="Sí"
                    width="150"
                    height="150"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleResponse("Si")}
                  />
                </div>
                <div>
                  <img
                    src="https://cdn.pixabay.com/photo/2016/06/01/16/41/thumb-1429333_1280.png"
                    alt="No"
                    width="150"
                    height="150"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleResponse("No")}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <h3>Justificación</h3>

                <br />
                <br />
                {response && <h3>Has seleccionado: {response}</h3>}
                <TextField
                  id="answer1"
                  value={justification}
                  onChange={handleJustificationChange}
                  variant="outlined"
                  fullWidth
                />

                <br />
                <br />
                <br />
                <Button
                  variant="contained"
                  type="submit"
                  style={{ width: "100%" }}
                  onClick={handleSubmit}
                >
                  Finalizar
                </Button>
              </form>
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
}
