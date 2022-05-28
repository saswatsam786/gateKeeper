import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import styled from "styled-components";
import { mobile } from "../Utilities/responsive";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth, storage } from "../firebaseConfig";
import firebase from "firebase";
import Webcam from "react-webcam";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 300,
  bgcolor: "#2aa08ac2",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
  outline: "none",
  "@media (max-width: 770px)": {
    minWidth: 300,
  },
};

const videoConstraints = {
  width: "100%",
  facingMode: "user",
};

export default function BasicModal() {
  const [user] = useAuthState(auth);
  const [id, setID] = useState();
  const [progress, setProgress] = useState(0);
  const [disable, setDisable] = useState(false);
  const [text, setText] = useState("Take a Selfie");

  useEffect(() => {
    db.collection("accounts")
      .where("email", "==", user.email)
      .onSnapshot((snapshot) => {
        snapshot.forEach(async (snap) => {
          setID(snap.id);
          if (!snap.data().imgURL.length) setOpen(true);
          else setOpen(false);
        });
      });
  }, [user]);

  const [open, setOpen] = React.useState(false);

  return (
    <>
      {progress === 100 ? (
        <Alert
          style={{ position: "absolute", zIndex: 2 }}
          onClose={() => {
            setOpen(false);
          }}
          severity="success"
        >
          <AlertTitle>Uploaded</AlertTitle>
          You image has been uploaded — <strong>Give Attendence</strong>
        </Alert>
      ) : (
        ""
      )}
      <div style={{ objectFit: "contain" }}>
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} style={{}}>
            <Webcam
              audio={false}
              height={1080}
              videoConstraints={videoConstraints}
              screenshotQuality={1}
              imageSmoothing={true}
              screenshotFormat="image/jpeg"
              style={{
                width: "100%",
                height: "100%",
                mobile: { height: "100%" },
              }}
            >
              {({ getScreenshot }) => (
                <Button
                  disabled={disable}
                  onClick={() => {
                    const imgSrc = getScreenshot();
                    setText("Wait for it");

                    const uploadTask = storage
                      .ref(`images/${user.displayName}/`)
                      .putString(imgSrc, "data_url");
                    uploadTask.on(
                      "state_changed",
                      (snapshot) => {
                        const progress = Math.round(
                          (snapshot.bytesTransferred / snapshot.totalBytes) *
                            100
                        );
                        setProgress(progress);
                      },
                      (error) => {
                        console.error(error);
                      },
                      () => {
                        storage
                          .ref("images")
                          .child(user.displayName)
                          .getDownloadURL()
                          .then(async (url) => {
                            const variable = db.collection("accounts").doc(id);
                            await variable.update({
                              imgURL:
                                firebase.firestore.FieldValue.arrayUnion(url),
                            });
                            setProgress(0);
                            setDisable(true);
                            setOpen(false);
                            window.location.reload();
                          })
                          .catch((err) => console.error(err));
                      }
                    );
                  }}
                >
                  {text}
                </Button>
              )}
            </Webcam>
          </Box>
        </Modal>
      </div>
    </>
  );
}

const Button = styled.button`
  background: linear-gradient(to right top, #65dfc9, #6cdbeb);
  border-radius: 2rem;
  color: white;
  padding: 1rem;
  outline: none;
  border: none;
  margin-top: 10px;
  font-size: 2rem;
  cursor: pointer;
  margin: 0 auto;
  width: 100%;
  &:hover {
    background: linear-gradient(to right bottom, #26a890, #3fe3fb);
    transition: all 1s ease-in-out;
  }
  ${mobile({ marginTop: "2px" })};
`;
