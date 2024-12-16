import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ResponsiveAppBar from "../responsiveappbar/ResponsiveAppBar";
import Stack from "@mui/material/Stack";
import { MdOutlinePlayArrow } from "react-icons/md";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Course() {
  const { id } = useParams();
  const courseId = id;
  const [course, setCourse] = useState(null);
  const [activities, setActivities] = useState([]);
  const { user } = useAuth0();
  const [completedActivities, setCompletedActivities] = useState([]);
  let videoUrl = "";

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/courses/${courseId}`)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los detalles del curso:", error);
      });

    axios
      .get(`http://127.0.0.1:8000/activity/course/${courseId}`)
      .then((response) => {
        setActivities(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las actividades:", error);
      });

    // Obtener las respuestas del usuario
    axios
      .get(`http://127.0.0.1:8000/answer/?user_email=${user.email}`)
      .then((response) => {
        const completed = response.data.map((answer) => answer.activity_id);
        setCompletedActivities(completed);
      })
      .catch((error) => {
        console.error("Error al obtener las respuestas del usuario:", error);
      });
  }, [courseId, user.email]);

  if (courseId === "1") {
    videoUrl = "https://www.youtube.com/embed/cJUXxjOeoCk";
  } else if (courseId === "2") {
    videoUrl = "https://www.youtube.com/embed/jW5KN4Kvpw0?si=QzGMAdQJ9lBfm4z";
  }

  if (!course) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <ResponsiveAppBar />
      <Grid
        container
        spacing={4}
        style={{
          padding: "5vh 10vh",
          height: "100%",
        }}
      >
        {/* Contenido del curso */}
        <Grid item xs={12} md={8} style={{ paddingRight: "2rem" }}>
          <Stack spacing={4}>
            <div>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: "1rem",
                }}
              >
                {course.title}
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "#666",
                  lineHeight: "1.8",
                }}
              >
                {course.description}
              </p>
            </div>

            {/* Actividades como Cards */}
            <div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
                Actividades
              </h2>
              <Grid container spacing={4} style={{ marginTop: "1rem" }}>
                {activities.map((activity) => (
                  <Grid item xs={12} sm={6} md={4} key={activity.id}>
                    <Card
                      style={{
                        borderRadius: "10px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          component="div"
                          style={{
                            fontWeight: "bold",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {activity.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          style={{ marginBottom: "1rem" }}
                        ></Typography>
                      </CardContent>
                      <CardActions>
                        <Link
                          to={
                            activity.content_type === "comp"
                              ? `${activity.path}`
                              : `/activity/${activity.id}`
                          }
                          style={{ textDecoration: "none", width: "100%" }}
                        >
                          <Button
                            variant="contained"
                            color={
                              completedActivities.includes(activity.id)
                                ? "success"
                                : "primary"
                            }
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            startIcon={<MdOutlinePlayArrow />}
                          >
                            {completedActivities.includes(activity.id)
                              ? "Completada"
                              : "Comenzar"}
                          </Button>
                        </Link>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          </Stack>
        </Grid>

        {/* Video */}
        <Grid
          item
          xs={12}
          md={4}
          style={{
            position: "sticky",
            top: "10vh",
          }}
        >
          <div
            style={{
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                position: "relative",
                paddingBottom: "56.25%", // Aspect ratio 16:9
                height: 0,
              }}
            >
              <iframe
                title="Course Video"
                width="100%"
                height="100%"
                src={videoUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              ></iframe>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
