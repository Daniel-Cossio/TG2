import React, { useState, useEffect } from "react";
import ResponsiveAppBar from "../responsiveappbar/ResponsiveAppBar";
import { useParams } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import DOMPurify from "dompurify";
import {
  Button,
  Typography,
  Container,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

export default function Activity() {
  const { id } = useParams();
  const activityId = id;
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [activity, setActivity] = useState(null);

  const [answers, setAnswers] = useState({
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    answer5: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get(`http://127.0.0.1:8000/activity/${activityId}`)
        .then((response) => {
          setActivity(response.data);
        })
        .catch((error) => {
          console.error(
            "Error al obtener los detalles de la actividad:",
            error
          );
        });
    }
  }, [activityId, isAuthenticated]);

  if (isLoading || !activity) {
    return (
      <Typography variant="h5" sx={{ textAlign: "center", marginTop: "20vh" }}>
        Cargando...
      </Typography>
    );
  }

  const activityExample = activity.example
    ? DOMPurify.sanitize(activity.example, {
        ADD_TAGS: ["iframe"],
        ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
      })
    : "";

  const handleChange = (e, question) => {
    setAnswers({ ...answers, [question]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para enviar tus respuestas.");
      return;
    }

    Object.entries(answers).forEach(async ([question, answerText]) => {
      if (answerText.trim() !== "") {
        const answerData = {
          user_email: user.email,
          activity_id: activityId,
          question_number: parseInt(question.replace("answer", "")),
          answer_text: answerText,
          rating: -1,
          comment: "",
        };
        try {
          await axios.post("http://127.0.0.1:8000/answer", answerData);
          setSnackbarMessage(`Respuestas guardadas con éxito.`);
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        } catch (error) {
          console.error(
            `Error al enviar respuesta ${answerData.question_number}:`,
            error
          );
          setSnackbarMessage(
            `Ya hay una respuesta guardada para esta actividad.`
          );
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      }
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container sx={{ paddingTop: "5%", paddingBottom: "5%" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={3}>
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
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Objetivo
                  </Typography>
                  <Typography variant="body1">{activity.objective}</Typography>
                </>
              )}
              {activity.metodology && (
                <>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Metodología
                  </Typography>
                  <Typography variant="body1">{activity.metodology}</Typography>
                </>
              )}
              {activity.resources && (
                <>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Recursos
                  </Typography>
                  <Typography variant="body1">{activity.resources}</Typography>
                </>
              )}
              {activity.introduction && (
                <>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Introducción
                  </Typography>
                  <Typography variant="body1">
                    {activity.introduction}
                  </Typography>
                </>
              )}
              {activity.analisis && (
                <>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Análisis de la situación
                  </Typography>
                  <Typography variant="body1">{activity.analisis}</Typography>
                </>
              )}
              {activity.evaluation && (
                <>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Evaluación de escenarios
                  </Typography>
                  <Typography variant="body1">{activity.evaluation}</Typography>
                </>
              )}
              {activityExample && (
                <div>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Actividad
                  </Typography>
                  <div
                    dangerouslySetInnerHTML={{ __html: activityExample }}
                    style={{ marginBottom: "20px" }}
                  />
                </div>
              )}
              {activity.question1 && (
                <>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Preguntas
                  </Typography>
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    {Object.keys(answers).map((key, index) => {
                      const questionKey = `question${index + 1}`;
                      if (activity[questionKey]) {
                        return (
                          <li key={key} style={{ padding: "10px 0" }}>
                            <Typography variant="body1" paragraph>
                              {activity[questionKey]}
                            </Typography>
                            <TextField
                              id={key}
                              value={answers[key]}
                              onChange={(e) => handleChange(e, key)}
                              variant="outlined"
                              fullWidth
                            />
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </>
              )}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
              >
                Finalizar
              </Button>
            </Stack>
          </Grid>
        </Grid>
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
      </Container>
    </>
  );
}
