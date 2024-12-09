import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
} from "@mui/material";
import ResponsiveAppBar from "../responsiveappbar/ResponsiveAppBar";

const Calification = () => {
  const [answers, setAnswers] = useState([]);
  const [activities, setActivities] = useState({});
  const [ratings, setRatings] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchAnswersAndActivities = async () => {
      try {
        const response_answers = await axios.get(
          "http://127.0.0.1:8000/answer"
        );
        const filteredAnswers = response_answers.data.filter(
          (answer) => answer.rating < 0
        );
        setAnswers(filteredAnswers);

        const response_activities = await axios.get(
          "http://127.0.0.1:8000/activity"
        );
        const activitiesMap = response_activities.data.reduce(
          (acc, activity) => {
            acc[activity.id] = {
              title: activity.title,
              question: activity.question, // Ajusta esto según el nombre de la columna en tu tabla
            };
            return acc;
          },
          {}
        );
        setActivities(activitiesMap);
      } catch (error) {
        console.error("Error al obtener las respuestas o actividades:", error);
      }
    };

    fetchAnswersAndActivities();
  }, []);

  const handleRatingChange = (event, questionNumber) => {
    setRatings({
      ...ratings,
      [questionNumber]: event.target.value,
    });
  };

  const handleSubmitRating = async (questionNumber) => {
    const rating = ratings[questionNumber];

    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    if (rating !== undefined) {
      try {
        await axios.patch("http://127.0.0.1:8000/answer/", {
          question_number: questionNumber,
          rating: rating,
        });
        alert(
          `Calificación para la pregunta ${questionNumber} guardada con éxito.`
        );
        // Avanzar a la siguiente pregunta
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } catch (error) {
        console.error("Error al enviar la calificación:", error);
        alert(
          `Error al enviar la calificación para la pregunta ${questionNumber}.`
        );
      }
    }
  };

  const currentAnswer = answers[currentQuestionIndex];

  return (
    <>
      <ResponsiveAppBar />
      <br />
      <Container>
        <Grid
          container
          spacing={3}
          style={{ paddingTop: "5%", paddingBottom: "5%" }}
        >
          <Grid item xs={12}>
            <Typography variant="h3" component="h1" gutterBottom>
              Respuestas de los cursos
            </Typography>
            <Typography variant="body1" paragraph>
              Aquí puedes ver todas las respuestas del curso que aún no tienen
              rating o que tienen un rating menor a cero y calificarlas.
            </Typography>
            <Paper elevation={3} style={{ padding: "20px" }}>
              {currentAnswer ? (
                <List>
                  <ListItem>
                    <ListItemText
                      primary={`Título: ${
                        activities[currentAnswer.question_number]?.title ||
                        "Cargando..."
                      }`}
                      secondary={`Pregunta: ${
                        currentAnswer.question_number || "Cargando..."
                      }`}
                    />
                    <ListItemText
                      secondary={`Respuesta: ${currentAnswer.answer_text}`}
                    />
                    <TextField
                      label="Calificación"
                      type="number"
                      value={ratings[currentAnswer.question_number] || ""}
                      onChange={(event) =>
                        handleRatingChange(event, currentAnswer.question_number)
                      }
                      inputProps={{ min: 0, max: 5 }}
                      style={{ marginRight: "10px" }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleSubmitRating(currentAnswer.question_number)
                      }
                    >
                      Enviar Calificación
                    </Button>
                  </ListItem>
                </List>
              ) : (
                <Typography variant="body1" paragraph>
                  No hay más preguntas para calificar.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Calification;
