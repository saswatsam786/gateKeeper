/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Webcam from "react-webcam";
import { mobile } from "../Utilities/responsive";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebaseConfig";
import * as faceapi from "face-api.js";

const videoConstraints = {
  width: "100%",
  facingMode: "user",
};

const Video = () => {
  const [user] = useAuthState(auth);
  const [id, setID] = useState("");
  const [initialise, setInitialise] = useState(false);
  const webcamRef = useRef();
  const canvasRef = useRef();
  const [height, setHeight] = useState(480);
  const [width, setWidth] = useState(640);
  const [image, setImage] = useState("");

  // eslint-disable-next-line no-restricted-globals

  useEffect(() => {
    db.collection("accounts")
      .where("email", "==", user.email)
      .get()
      .then((querySnapshot) => querySnapshot.forEach((doc) => setID(doc.id)));

    db.collection("accounts")
      .where("email", "==", user.email)
      .onSnapshot((snapshot) => {
        snapshot.forEach(async (snap) => {
          setImage(snap.data().imgURL[0]);
        });
      });
  }, [user]);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL = process.env.PUBLIC_URL + "/models";
      setInitialise(true);
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL),
      ]).then(startVideo);
    };
    loadModels();
  }, []);

  const detect = async () => {
    setInterval(async () => {
      if (initialise) {
        setInitialise(false);
      }
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
        webcamRef.current
      );
      const displaySize = { width: width, height: height };

      faceapi.matchDimensions(canvasRef.current, displaySize);

      const detections = await faceapi
        .detectAllFaces(
          webcamRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceExpressions();
      const resizeDetections = faceapi.resizeResults(detections, displaySize);
      canvasRef.current.getContext("2d").clearRect(0, 0, width, height);
      faceapi.draw.drawDetections(canvasRef.current, resizeDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizeDetections);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizeDetections);
    }, 1000);
  };

  const startVideo = async () => {
    navigator.getUserMedia(
      {
        video: true,
      },
      (stream) => (webcamRef.current.srcObject = stream),
      (err) => console.log(err)
    );
  };

  return (
    <Camera style={{ position: "relative" }}>
      <video
        ref={webcamRef}
        autoPlay
        muted
        style={{ width: "100%" }}
        onPlay={detect}
      />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />

      {/* <Webcam
        ref={webcamRef}
        audio={false}
        height={1080}
        videoConstraints={videoConstraints}
        style={{ width: "100%", height: "100%" }}
        onPlay={detect}
      /> */}
    </Camera>
  );
};

export default Video;

const Camera = styled.div`
  height: 200%;
  width: 100%;
  display: flex;
  justify-content: center;
  object-fit: contain;
  ${mobile({ minWidth: "120%" })}
`;
