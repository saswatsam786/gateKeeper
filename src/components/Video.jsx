import React, { useState } from "react";
import styled from "styled-components";
import Webcam from "react-webcam";
import { storage } from "../firebaseConfig";

const videoConstraints = {
  width: "90%",
  facingMode: "user",
};

const Video = () => {
  const [image, setImage] = useState();
  const [url, setUrl] = useState();
  return (
    <Camera>
      <Webcam
        audio={false}
        height={720}
        videoConstraints={videoConstraints}
        screenshotQuality={1}
        imageSmoothing={true}
        screenshotFormat="image/jpeg"
        style={{ width: "100%", height: "100%" }}
      >
        {({ getScreenshot }) => (
          <button
            onClick={() => {
              const imgSrc = getScreenshot();

              const uploadTask = storage
                .ref(`images/3`)
                .putString(imgSrc, "data_url");
              uploadTask.on(
                "state_changed",
                (snapshot) => {},
                (error) => {
                  console.error(error);
                },
                () => {
                  storage
                    .ref("images")
                    .child("3")
                    .getDownloadURL()
                    .then((url) => {
                      console.log(url);
                      setUrl(url);
                    });
                }
              );
              //   console.log(imageSrc);
            }}
          >
            Capture photo
          </button>
        )}
      </Webcam>
      <img src={image} alt="helo" />
      {console.log(url)}
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
`;
