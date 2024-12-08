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
} from "@mui/material";

const TeamSelect = () => {
  const [userGroup, setUserGroup] = useState(null);
  const { user } = useAuth0();
  const [role, setRole] = useState("");
  const [answer, setAnswer] = useState("");

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
      alert(
        `Respuesta a pregunta ${answer.question_number} guardada con éxito.`
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Error al enviar la respuesta:", error);
      alert(
        `Ya hay una respuesta guardada a la pregunta ${answerData.question_number}.`
      );
    }
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
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default TeamSelect;
