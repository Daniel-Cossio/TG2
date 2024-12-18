import React, { useState, useEffect } from "react";
import ResponsiveAppBar from "../../responsiveappbar/ResponsiveAppBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";
import DOMPurify from "dompurify";
import TextField from "@mui/material/TextField";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  FormControl,
  Typography,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";

export default function Debate() {
  const [activity, setActivity] = useState(null);
  const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

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
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/activity/7`);
        setActivity(response.data);
      } catch (error) {
        console.error("Error al obtener los detalles de la actividad:", error);
      }
    };

    fetchActivity();
  }, []); // El array vacío asegura que esto solo se ejecute una vez cuando el componente se monta

  if (!activity) {
    return <div>Cargando...</div>;
  }
  const handleChange = (e, question) => {
    setAnswers({ ...answers, [question]: e.target.value });
  };
  const activityExample = DOMPurify.sanitize(activity.example);
  const activityEvaluation = DOMPurify.sanitize(activity.evaluation);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      setSnackbarMessage("Debes iniciar sesión para enviar tus respuestas.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    Object.entries(answers).forEach(([question, answerText]) => {
      if (answerText.trim() !== "") {
        const answerData = {
          user_email: user.email,
          activity_id: "7",
          question_number: parseInt(question.replace("answer", "")),
          answer_text: answerText,
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
              <br />
              <h3>Objetivo</h3>
              {activity.objective}
              <h3>Metodología</h3>
              {activity.metodology}
              <h3>Recursos</h3>
              {activity.resources}
              <h3>Evaluación</h3>
              <div dangerouslySetInnerHTML={{ __html: activityEvaluation }} />
              <br />
              <div>
                <h3>Ejemplo</h3>
                <div dangerouslySetInnerHTML={{ __html: activityExample }} />
              </div>
              {activity.question1 && (
                <>
                  <h3>Preguntas</h3>
                  <ul>
                    {activity.question1 && (
                      <li
                        style={{
                          padding: "10px",
                        }}
                      >
                        {activity.question1} <br />
                        <TextField
                          id="answer1"
                          value={answers.answer1}
                          onChange={(e) => handleChange(e, "answer1")}
                          variant="outlined"
                          fullWidth
                        />
                      </li>
                    )}
                    {activity.question2 && (
                      <li>
                        {activity.question2} <br />
                        <TextField
                          id="answer2"
                          value={answers.answer2}
                          onChange={(e) => handleChange(e, "answer2")}
                          variant="outlined"
                          fullWidth
                        />{" "}
                      </li>
                    )}
                    {activity.question3 && (
                      <li>
                        {activity.question3} <br />
                        <TextField
                          id="answer3"
                          value={answers.answer3}
                          onChange={(e) => handleChange(e, "answer3")}
                          variant="outlined"
                          fullWidth
                        />
                      </li>
                    )}
                    {activity.question4 && (
                      <li>
                        {activity.question4} <br />
                        <TextField
                          id="answer4"
                          value={answers.answer4}
                          onChange={(e) => handleChange(e, "answer4")}
                          variant="outlined"
                          fullWidth
                        />
                      </li>
                    )}
                    {activity.question5 && (
                      <li>
                        {activity.question5} <br />
                        <TextField
                          id="answer5"
                          value={answers.answer5}
                          onChange={(e) => handleChange(e, "answer5")}
                          variant="outlined"
                          fullWidth
                        />
                      </li>
                    )}
                  </ul>
                </>
              )}
              <br />
              <br />
              {activity.question1 && (
                <>
                  <Button
                    variant="contained"
                    type="submit"
                    style={{ width: "100%" }}
                    onClick={handleSubmit}
                  >
                    Finalizar
                  </Button>
                </>
              )}
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
      <br />
      <br />
    </>
  );
}
