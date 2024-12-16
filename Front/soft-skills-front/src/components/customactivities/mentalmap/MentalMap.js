import React, { useState, useEffect } from "react";
import ResponsiveAppBar from "../../responsiveappbar/ResponsiveAppBar";
import axios from "axios";
import DOMPurify from "dompurify";
import {
  Button,
  Snackbar,
  Alert,
  Grid,
  Container,
  Typography,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function MentalMap() {
  const [activity, setActivity] = useState(null);
  const { user } = useAuth0();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/activity/6`)
      //.get(`https://tg2-wfw8.onrender.com/activity/6`)
      .then((response) => {
        setActivity(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los detalles de la actividad:", error);
      });
  }, []);

  var activityExample;
  if (activity && activity.example) {
    activityExample = DOMPurify.sanitize(activity.example);
  } else {
    activityExample = "";
  }

  if (!activity) {
    return <Typography variant="h6">Cargando...</Typography>;
  }

  const handleSubmit = () => {
    const answerData = {
      user_email: user.email,
      activity_id: "6",
      question_number: 1,
      answer_text: "Finalizado",
      rating: -1,
      comment: "",
    };

    axios
      .post("http://127.0.0.1:8000/answer", answerData)
      //.post("https://tg2-wfw8.onrender.com/answer", answerData)
      .then((response) => {
        console.log(
          `Respuesta ${answerData.question_number} enviada:`,
          response.data
        );
        setSnackbarMessage(
          `Respuesta a pregunta ${answerData.question_number} guardada con éxito.`
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error(
          `Error al enviar respuesta ${answerData.question_number}:`,
          error
        );
        setSnackbarMessage(
          `Ya hay una respuesta guardada a la pregunta ${answerData.question_number}.`
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container style={{ paddingTop: "5%", paddingBottom: "5%" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={4}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ color: "primary.main", textAlign: "center" }}
              >
                {activity.title}
              </Typography>

              <Typography variant="h5" component="h2" gutterBottom>
                Objetivo
              </Typography>
              <Typography variant="body1" paragraph>
                {activity.objective}
              </Typography>

              <Typography variant="h5" component="h2" gutterBottom>
                Metodología
              </Typography>
              <Typography variant="body1" paragraph>
                {activity.metodology}
              </Typography>

              <Typography variant="h5" component="h2" gutterBottom>
                Recursos
              </Typography>
              <Typography variant="body1" paragraph>
                {activity.resources}
              </Typography>

              <Typography variant="h5" component="h2" gutterBottom>
                Introducción
              </Typography>
              <Typography variant="body1" paragraph>
                {activity.introduction}
              </Typography>

              {activity.analisis && (
                <>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Análisis de la situación
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {activity.analisis}
                  </Typography>
                </>
              )}

              {activity.evaluation && (
                <>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Evaluación de escenarios
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {activity.evaluation}
                  </Typography>
                </>
              )}

              {activityExample && (
                <>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Actividad
                  </Typography>
                  <div
                    dangerouslySetInnerHTML={{ __html: activityExample }}
                    style={{ marginBottom: "20px" }}
                  />
                </>
              )}

              <iframe
                style={{ width: "100%", height: "700px" }}
                src="https://viewer.diagrams.net/?highlight=FFFFFF&edit=https%3A%2F%2Fdrive.google.com%2Ffile%2Fd%2F1L9-7wjPNLXcUDmBdhkp-Og5nT7Aws27g%2Fview%3Fusp%3Dsharing&nav=1&title=Diagrama%20sin%20t%C3%ADtulo.drawio#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1L9-7wjPNLXcUDmBdhkp-Og5nT7Aws27g%26export%3Ddownload"
                scrolling="no"
                title="Mental Map Diagram"
              ></iframe>

              {activity.question1 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Marcar como finalizado
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
