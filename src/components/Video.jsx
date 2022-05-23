import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { mobile } from "../Utilities/responsive";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebaseConfig";
import * as faceapi from "face-api.js";

const Video = () => {
  const [user] = useAuthState(auth);
  const [id, setID] = useState("");
  const [initialise, setInitialise] = useState(false);
  const webcamRef = useRef();
  const canvasRef = useRef();
  const [height, setHeight] = useState(480);
  const [width, setWidth] = useState(640);
  const [faceMatcher, setFaceMatcher] = useState();
  const [data, setData] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    db.collection("accounts")
      .where("email", "==", user.email)
      .get()
      .then((querySnapshot) => querySnapshot.forEach((doc) => setID(doc.id)));
  }, [user]);

  useEffect(() => {
    db.collection("accounts").onSnapshot((snapshot) => {
      setData(
        snapshot.docs.map((doc) => ({
          name: doc.data().name,
          imgURL: doc.data().imgURL[0],
        }))
      );
    });
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL = process.env.PUBLIC_URL + "/models";
      setInitialise(true);
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL),
      ]).then(startVideo);
    };
    loadModels();
  }, []);

  const detect = async () => {
    const labeledFaceDescriptors = await loadImage();
    console.log(labeledFaceDescriptors);
    setFaceMatcher(labeledFaceDescriptors);
    setInterval(async () => {
      if (initialise) {
        setInitialise(false);
      }
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
        webcamRef.current
      );

      console.log(date.toUTCString());

      const faceMat = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

      const displaySize = { width: width, height: height };

      faceapi.matchDimensions(canvasRef.current, displaySize);

      const detections = await faceapi
        .detectAllFaces(
          webcamRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptors()
        .withAgeAndGender();

      const resizeDetections = faceapi.resizeResults(detections, displaySize);
      canvasRef.current.getContext("2d").clearRect(0, 0, width, height);
      faceapi.draw.drawDetections(canvasRef.current, resizeDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizeDetections);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizeDetections);

      // eslint-disable-next-line no-lone-blocks
      // {
      //   resizeDetections.forEach((detection) => {
      //     console.log(detection);
      //     const box = detection.detection.box;
      //     const drawBox = new faceapi.draw.DrawBox(box, {
      //       label: Math.round(detection.age) + " year old " + detection.gender,
      //     });
      //     drawBox.draw(canvasRef.current);
      //   });
      // }

      const results = resizeDetections.map((detect) => {
        return faceMat.findBestMatch(detect.descriptor);
      });

      console.log(results);

      results.forEach((result, i) => {
        const box = resizeDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result.toString(),
        });
        drawBox.draw(canvasRef.current);
      });
    }, 1000);
  };

  async function loadImage() {
    return Promise.all(
      data.map(async ({ name, imgURL }) => {
        const descriptions = [];
        for (let i = 0; i <= 1; i++) {
          const img = await faceapi.fetchImage(`${imgURL}`);
          const detections = await faceapi
            .detectAllFaces(img)
            .withFaceLandmarks()
            .withFaceDescriptors();
          descriptions.push(new Float32Array(detections[0].descriptor));
        }
        return new faceapi.LabeledFaceDescriptors(name, descriptions);
      })
    );
  }

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
        autoPlay={true}
        muted
        style={{ width: "100%" }}
        onPlay={detect}
      />
      <canvas ref={canvasRef} style={{ position: "absolute", width: "100%" }} />
    </Camera>
  );
};

export default Video;

const Camera = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  object-fit: contain;
  ${mobile({ minWidth: "120%" })}
`;
