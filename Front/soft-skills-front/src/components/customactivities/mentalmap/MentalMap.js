import React, { useState, useEffect } from "react";
import ResponsiveAppBar from "../../responsiveappbar/ResponsiveAppBar";
import axios from "axios";
import Grid from "@mui/material/Grid";
import DOMPurify from "dompurify";
import { Button, Snackbar, Alert } from "@mui/material";
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
  });
  var activityExample;
  if (activity != null && activity.example != null) {
    activityExample = DOMPurify.sanitize(activity.example);
  } else {
    activityExample = "";
  }
  if (!activity) {
    return <div>Cargando...</div>;
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
      <br />
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
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              {activity.title}
            </h1>
            <h3>Objetivo</h3>
            {activity.objective}
            <h3>Metodología</h3>
            {activity.metodology}
            <h3>Recursos</h3>
            {activity.resources}
            <h3>Introducción</h3>
            {activity.introduction}
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
            {activityExample && (
              <div>
                <h2>Actividad</h2>{" "}
                <span className="max-w-prose text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                  <div dangerouslySetInnerHTML={{ __html: activityExample }} />
                </span>
              </div>
            )}
            <br />
            <br />
            <br />
            <div>
              <iframe
                style={{ width: "100%", height: "700px" }}
                src="https://viewer.diagrams.net/?highlight=FFFFFF&edit=https%3A%2F%2Fdrive.google.com%2Ffile%2Fd%2F1L9-7wjPNLXcUDmBdhkp-Og5nT7Aws27g%2Fview%3Fusp%3Dsharing&nav=1&title=Diagrama%20sin%20t%C3%ADtulo.drawio#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1L9-7wjPNLXcUDmBdhkp-Og5nT7Aws27g%26export%3Ddownload"
                scrolling="no"
                title="Mental Map Diagram"
              ></iframe>
            </div>
            <br />
            {activity.question1 && (
              <>
                <Button
                  variant="contained"
                  type="submit"
                  style={{ width: "100%" }}
                  onClick={handleSubmit}
                >
                  Marcar como finalizado
                </Button>
              </>
            )}
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
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
      <br />
      <br />
    </>
  );
}
