import React, { useState, useEffect } from "react";
import ResponsiveAppBar from "../../responsiveappbar/ResponsiveAppBar";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useAuth0 } from "@auth0/auth0-react";

import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Container,
  Snackbar,
  Alert,
  Card,
  CardContent,
} from "@mui/material";

const TeamSelect = ({ userEmail }) => {
  const [userGroup, setUserGroup] = useState(null);
  const { user } = useAuth0();
  const [role, setRole] = useState("");
  const [answer, setAnswer] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [hasAnsweredQuestion1, setHasAnsweredQuestion1] = useState(false);
  const [allResponses, setAllResponses] = useState([]);
  const [userResponses, setUserResponses] = useState([]);
  const [otherUserResponses, setOtherUserResponses] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();

  useEffect(() => {
    const assignTeam = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/user_group/assign/",
          { user_email: user.email }
        );
        setUserGroup(response.data);
      } catch (error) {
        console.error("Error al asignar el equipo:", error);
      }
    };
    if (user && user.email) {
      assignTeam();
    }
  }, [user]);

  useEffect(() => {
    // Consulta todas las respuestas al cargar el componente
    axios
      .get("http://127.0.0.1:8000/answer")
      .then((response) => {
        console.log("All responses:", response.data); // Debugging
        setAllResponses(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener todas las respuestas:", error);
      });

    // Consulta todos los grupos de usuarios al cargar el componente
    axios
      .get("http://127.0.0.1:8000/user_group")
      .then((response) => {
        console.log("User groups:", response.data); // Debugging
        setUserGroups(response.data);
        // Encuentra el grupo del usuario actual
        const currentUserGroup = response.data.find((group) =>
          group.members.includes(user.email)
        );
        setUserGroup(currentUserGroup);
      })
      .catch((error) => {
        console.error("Error al obtener los grupos de usuarios:", error);
      });
  }, [user]);

  useEffect(() => {
    if (user && user.email) {
      // Filtra las respuestas del usuario por activity_id y user_email
      const filteredUserResponses = allResponses.filter(
        (response) =>
          response.activity_id === "8" && response.user_email === user.email
      );
      setUserResponses(filteredUserResponses);

      // Verifica si el usuario ya ha respondido a la pregunta 1
      const answeredQuestion1 = filteredUserResponses.some(
        (response) => response.question_number === 1
      );
      setHasAnsweredQuestion1(answeredQuestion1);

      const filteredOtherUserResponses = allResponses.filter(
        (response) =>
          response.activity_id === "8" && response.user_email !== user.email
      );
      setOtherUserResponses(filteredOtherUserResponses);
    }
  }, [allResponses, user, userGroup]);

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const answerData = {
      user_email: user.email,
      activity_id: "8",
      question_number: 1,
      answer_text: role + " - " + answer,
      rating: -1,
      comment: "",
    };
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/answer/",
        answerData
      );
      console.log("Respuesta enviada:", response.data);
      setUserResponses([...userResponses, answerData]);
      setHasAnsweredQuestion1(true);
      setSnackbarMessage("Respuesta enviada con éxito.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error al enviar la respuesta:", error);
      setSnackbarMessage("Error al enviar la respuesta.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSubmitQuestion2 = async (event) => {
    event.preventDefault();
    const answerData = {
      user_email: user.email,
      activity_id: "8",
      question_number: 2,
      answer_text: answer2,
      rating: -1,
      comment: "",
    };

    try {
      await axios.post("http://127.0.0.1:8000/answer", answerData);
      // Actualiza las respuestas del usuario después de enviar la respuesta
      setUserResponses([...userResponses, answerData]);
      setSnackbarMessage("Respuesta enviada con éxito.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error al guardar la respuesta:", error);
      setSnackbarMessage("Error al enviar la respuesta.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container>
        <Grid
          container
          spacing={3}
          style={{ paddingTop: "5%", paddingBottom: "5%" }}
        >
          <Grid item xs={12}>
            <Typography variant="h3" component="h1" gutterBottom>
              Asignación de equipo
            </Typography>
            <Typography variant="body1" paragraph>
              Si hay un equipo disponible para la actividad se asigna
              automáticamente. Sino, se le asignará un equipo aleatorio y deberá
              investigar la parte de información que le corresponda, para luego
              compartir con el compañero que se una al equipo.
            </Typography>
            {userGroup && (
              <>
                <Typography variant="h6" component="p">
                  <strong>Su equipo es el equipo {userGroup.team}.</strong>
                </Typography>
                <Typography variant="h6" component="p">
                  <strong>
                    El tema asignado al equipo {userGroup.team} es:{" "}
                    {userGroup.topic}
                  </strong>
                </Typography>
                <Typography variant="body1" paragraph>
                  {userGroup.topic.description}
                </Typography>
                <Typography variant="body1" paragraph>
                  La distribución de la investigación es la siguiente:
                </Typography>
                <Typography variant="body1" paragraph>
                  Persona A: Investiga las causas del cambio climático, como las
                  emisiones de gases de efecto invernadero y la deforestación.
                </Typography>
                <Typography variant="body1" paragraph>
                  Persona B: Investiga los efectos del cambio climático en el
                  planeta, como el aumento del nivel del mar y el derretimiento
                  de los glaciares.
                </Typography>
                {!hasAnsweredQuestion1 ? (
                  <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="role-select-label">
                        Seleccione su rol
                      </InputLabel>
                      <Select
                        labelId="role-select-label"
                        value={role}
                        onChange={handleRoleChange}
                        required
                      >
                        <MenuItem value="">
                          <em>Seleccione...</em>
                        </MenuItem>
                        <MenuItem value="Persona A">Persona A</MenuItem>
                        <MenuItem value="Persona B">Persona B</MenuItem>
                      </Select>
                    </FormControl>
                    {role && (
                      <>
                        <Typography variant="body1" paragraph>
                          <strong>
                            Usted ha seleccionado ser {role}. Por favor,
                            investigue la parte correspondiente y envíe su
                            respuesta a continuación.
                          </strong>
                        </Typography>
                        <FormControl fullWidth margin="normal">
                          <TextField
                            label="Respuesta de la investigación"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            required
                          />
                        </FormControl>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          className="mt-3"
                        >
                          Enviar Respuesta
                        </Button>
                      </>
                    )}
                  </form>
                ) : (
                  <form onSubmit={handleSubmitQuestion2}>
                    <FormControl fullWidth margin="normal">
                      <TextField
                        label="Ya has respondido por primera vez, ahora basado en las respuestas de tu equipo puedes complementar y mejorar tu investigación"
                        value={answer2}
                        onChange={(e) => setAnswer2(e.target.value)}
                        required
                      />
                    </FormControl>
                    <br />
                    <br />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className="mt-3"
                    >
                      Enviar Respuesta
                    </Button>
                  </form>
                )}
                <br />
                <div>
                  <Typography variant="h6" component="p">
                    <strong>Tus respuestas:</strong>
                  </Typography>
                  <br />
                  <br />
                  <Grid container spacing={2}>
                    {userResponses.map((response, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card style={{ marginBottom: "16px" }}>
                          <CardContent>
                            <Typography variant="body2" component="p">
                              {response.answer_text}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </div>
                <div>
                  <br />
                  <br />
                  <Typography variant="h6" component="p">
                    <strong>Respuestas de tu equipo:</strong>
                  </Typography>
                  <Grid container spacing={2}>
                    {otherUserResponses.map((response, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card style={{ marginBottom: "16px" }}>
                          <CardContent>
                            <Typography variant="body2" component="p">
                              {response.answer_text}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              </>
            )}
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
};

export default TeamSelect;
