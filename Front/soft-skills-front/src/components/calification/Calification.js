import React, { useState, useEffect } from "react";
import axios from "axios";
import ResponsiveAppBar from "../responsiveappbar/ResponsiveAppBar";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

const Calification = ({ activityId }) => {
  const [answers, setAnswers] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/answers?activity_id=${activityId}`
        );
        setAnswers(response.data);
      } catch (error) {
        console.error("Error al obtener las respuestas:", error);
      }
    };

    fetchAnswers();
  }, [activityId]);

  const handleRatingChange = (questionNumber, rating) => {
    setRatings({ ...ratings, [questionNumber]: rating });
  };

  const handleCommentChange = (questionNumber, comment) => {
    setComments({ ...comments, [questionNumber]: comment });
  };

  const handleSubmit = async (questionNumber) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/answers/rate`, {
        activity_id: activityId,
        question_number: questionNumber,
        rating: ratings[questionNumber],
        comment: comments[questionNumber],
      });
      console.log("Calificación guardada:", response.data);
    } catch (error) {
      console.error("Error al guardar la calificación:", error);
    }
  };

  return (
    <>
      <ResponsiveAppBar />
      <br />
      <Grid
        container
        spacing={2}
        style={{ padding: "10vh", height: "90vh", paddingLeft: "200px" }}
      >
        <Grid item xs={12}>
          <Stack spacing={2}>
            <div>
              <div>
                <h3>Calificación de Respuestas</h3>
                {answers.map((answer) => (
                  <div key={answer.question_number}>
                    <p>{answer.answer_text}</p>
                    <label>
                      Calificación:
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={ratings[answer.question_number] || ""}
                        onChange={(e) =>
                          handleRatingChange(
                            answer.question_number,
                            e.target.value
                          )
                        }
                      />
                    </label>
                    <label>
                      Comentario:
                      <textarea
                        value={comments[answer.question_number] || ""}
                        onChange={(e) =>
                          handleCommentChange(
                            answer.question_number,
                            e.target.value
                          )
                        }
                      />
                    </label>
                    <button
                      onClick={() => handleSubmit(answer.question_number)}
                    >
                      Enviar
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </Stack>
        </Grid>
      </Grid>
      <br />
      <br />
    </>
  );
};

export default Calification;
