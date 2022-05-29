/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { mobile } from "../Utilities/responsive";
import Alert from "@mui/material/Alert";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebaseConfig";
import firebase from "firebase";
import * as faceapi from "face-api.js";

const Video = () => {
  const [user] = useAuthState(auth);
  const [id, setID] = useState("");
  const [accid, setAccid] = useState("");
  const [privatekey, setPrivatekey] = useState("");
  const [initialise, setInitialise] = useState(false);
  const webcamRef = useRef();
  const canvasRef = useRef();
  const [height, setHeight] = useState(480);
  const [width, setWidth] = useState(640);
  const [data, setData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [latestDate, setLatestDate] = useState();
  const [attendence, setAttendence] = useState(false);
  const [dbAttendence, setdbAttendence] = useState(false);
  const [response, setResponse] = useState("");
  const [userImg, setUserImg] = useState("");

  // assign name to respective image URL of all accounts
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

  // gets id, hedera account id,private key, user image url, latest date of attendence
  useEffect(() => {
    db.collection("accounts")
      .where("email", "==", user.email)
      .onSnapshot((snapshot) => {
        snapshot.forEach((snap) => {
          setID(snap.id);
          const month = getMonth(date.getMonth());
          setAccid(snap.data().accid);
          setPrivatekey(snap.data().privatekey);
          setUserImg(snap.data().imgURL[0]);
          const latestAttendence =
            snap.data()[month][snap.data()[month].length - 1];
          setLatestDate(latestAttendence);
          let dat = date.getDate();
          dat === latestAttendence && setdbAttendence(true);
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // starts the camera and sets the model
  useEffect(() => {
    const loadModels = async () => {
      const startVideo = async () => {
        navigator.getUserMedia(
          {
            video: true,
          },
          (stream) => (webcamRef.current.srcObject = stream),
          (err) => console.log(err)
        );
      };
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
    // eslint-disable-next-line no-use-before-define
  }, []);

  function getMonth(monthNum) {
    const monthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    return monthNames[monthNum];
  }

  // add attendence to database
  async function addAttendence(attended) {
    let hours = date.getHours();
    let dat = date.getDate();
    if (attended && hours <= 23 && hours >= 11) {
      const variable = db.collection("accounts").doc(id);
      const month = getMonth(date.getMonth());
      await variable
        .update({
          [month]: firebase.firestore.FieldValue.arrayUnion(dat),
        })
        .then(() => {
          setdbAttendence(true);
        });
    }
  }

  // recognition and emotion detection
  const detect = async () => {
    const labeledFaceDescriptors = await loadImage();

    setInterval(async () => {
      if (initialise) {
        setInitialise(false);
      }
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
        webcamRef.current
      );

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

      const results = resizeDetections.map((detect) => {
        return faceMat.findBestMatch(detect.descriptor);
      });

      !attendence &&
        results.map((result) => {
          setAttendence(result.label === user.displayName);
          return result.label === user.displayName && addAttendence(true);
        });

      results.forEach((result, i) => {
        const box = resizeDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result.toString(),
        });
        drawBox.draw(canvasRef.current);
      });
    }, 1000);
  };

  // gets image from database and adds descriptors to it
  async function loadImage() {
    return Promise.all(
      data.map(async ({ name, imgURL }) => {
        const descriptions = [];
        for (let i = 0; i <= 1; i++) {
          const img = await faceapi.fetchImage(`${imgURL || userImg}`);
          const detections = await faceapi
            .detectAllFaces(img)
            .withFaceLandmarks()
            .withFaceDescriptors();
          descriptions.push(new Float32Array(detections[0].descriptor));
        }
        return new faceapi.LabeledFaceDescriptors(
          name || user.displayName,
          descriptions
        );
      })
    );
  }

  return (
    <>
      {dbAttendence && (
        <Alert style={{ position: "absolute", zIndex: 3, top: 0 }}>
          Your attendece has been recorded for today
        </Alert>
      )}
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
          style={{ position: "absolute", width: "100%" }}
        />
      </Camera>
      <LatestAttendence style={{ color: "#658ec6" }}>
        Last attendence was submitted on: {latestDate}th
      </LatestAttendence>
    </>
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

const LatestAttendence = styled.h5`
  position: absolute;
  bottom: 0;
  padding: 3px 5px;
  border-radius: 10px;
  background: linear-gradient(to right top, #65dfc9, #6cdbeb);
`;
