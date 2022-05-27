import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Delete } from "@mui/icons-material";
import { db, auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import axios from "axios";

const Settings = () => {
  const [user] = useAuthState(auth);
  const [accbal, setAccbal] = useState("");
  const [accid, setAccid] = useState("");
  const [dbId, setDbId] = useState("");
  const [privatekey, setPrivatekey] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [open, setOpen] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    db.collection("accounts")
      .where("email", "==", user.email)
      .onSnapshot((snapshot) => {
        snapshot.forEach((snap) => {
          setDbId(snap.id);
          setPrivatekey(snap.data().privatekey);
          setAccid(snap.data().accid);
          setCreateDate(snap.data().accountCreationDate);
        });
      });
    accid !== "" && fetchBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accid, privatekey, user.email]);

  async function fetchBalance() {
    setAccbal("");
    let data = await axios.post(" http://localhost:8000/balance", {
      id: accid,
      key: privatekey,
    });
    setAccbal(
      (data.data.data.balance._valueInTinybar / 100000000 - 0).toFixed(4)
    );
  }

  async function deleteAccount() {
    await axios.post(`https://movienix-backend.herokuapp.com/deleteAccount`, {
      id: accid,
      key: privatekey,
    });
    console.log("server deleted");
    // console.log(data.data.success);
    setDisableBtn(true);

    user && (await db.collection("accounts").doc(dbId).delete());

    setTimeout(() => {
      auth.signOut();
      window.location = "/";
    }, 1000);
  }

  return (
    <div
      style={{
        width: "95%",
        height: "100%",
      }}
    >
      <Grid item xs={12} md={6}>
        <Card
          elevation={2}
          style={{
            background: "linear-gradient(to right top,#65dfc9,#6cdbeb)",
            borderRadius: "10px",
          }}
        >
          <CardContent>
            <List>
              <ListItem>
                <ListItemText
                  className="listtext"
                  primary="Account ID"
                  sx={{
                    color: "#658ec6",
                    "& .MuiTypography-root": {
                      fontSize: "larger",
                    },
                  }}
                  secondary={accid}
                />
              </ListItem>
              <Divider />
              <ListItem>
                {accbal === "" ? (
                  <ListItemText
                    className="listtext"
                    sx={{
                      color: "#658ec6",
                      "& .MuiTypography-root": {
                        fontSize: "larger",
                      },
                    }}
                    primary="Account Balance"
                    secondary={
                      <lottie-player
                        id="loader"
                        src="https://assets8.lottiefiles.com/packages/lf20_fl4lnt7z.json"
                        background="transparent"
                        speed="1"
                        style={{
                          padding: "0",
                          width: "25px",
                          height: "25px",
                          color: "#fff",
                        }}
                        loop
                        autoplay
                      ></lottie-player>
                    }
                  />
                ) : (
                  <ListItemText
                    className="listtext"
                    primary="Account Balance"
                    sx={{
                      color: "#658ec6",
                      "& .MuiTypography-root": {
                        fontSize: "larger",
                      },
                    }}
                    secondary={`${accbal} ℏ`}
                  />
                )}
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  className="listtext"
                  sx={{
                    color: "#658ec6",
                    "& .MuiTypography-root": {
                      fontSize: "larger",
                    },
                  }}
                  primary="Transaction History"
                  secondary={
                    <>
                      Click here to view
                      <IconButton
                        sx={{ color: "white" }}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://hashscan.io/#/testnet/account/${accid}?type=`}
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </>
                  }
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  className="listtext"
                  sx={{
                    color: "#658ec6",
                    "& .MuiTypography-root": {
                      fontSize: "larger",
                    },
                  }}
                  primary="Account Creation Date"
                  secondary={createDate}
                />
              </ListItem>
            </List>
          </CardContent>
          <CardActions
            sx={{
              margin: "auto",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Button
              disabled={disableBtn}
              onClick={handleClickOpen}
              color="error"
              startIcon={<Delete />}
            >
              Delete Account
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Are you sure you want to delete your account?"}
              </DialogTitle>
              <DialogActions>
                <Button onClick={handleClose} autoFocus>
                  Cancel
                </Button>
                <div className="navbar-link">
                  <Button
                    color="error"
                    sx={{ background: "error" }}
                    onClick={() => {
                      setOpen(false);
                      deleteAccount();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </DialogActions>
            </Dialog>
          </CardActions>
        </Card>
      </Grid>
    </div>
  );
};

export default Settings;
