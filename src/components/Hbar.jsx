import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import styled from "styled-components";
import { db, auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import axios from "axios";
import firebase from "firebase";

const Hbar = () => {
  const [user] = useAuthState(auth);
  const [accid, setAccid] = useState("");
  const [docid, setDocId] = useState("");
  const [accbal, setAccbal] = useState("");
  const [privatekey, setPrivatekey] = useState("");
  const [button, setButton] = useState(false);
  const [transaction, setTransaction] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [date, setDate] = useState(new Date());
  const [streaks, setStreaks] = useState(0);
  const [presents, setPresents] = useState(0);
  const [streakTransaction, setStreakTransaction] = useState(false);
  const [transactionDone, setTransactionDone] = useState(false);

  const initialState = {
    gifteeAccID: "",
    gifteeSend: "",
  };
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

  const [giftee, setGiftee] = useState(initialState);

  const { gifteeAccID, gifteeSend } = giftee;

  function getStreaks(presents) {
    let i = 0,
      streaks = 0,
      currLen = 0;

    for (let j = 1; j < 31; j++) {
      if (j === presents[i]) {
        currLen++;
        i++;
      } else {
        streaks = Math.max(streaks, currLen);
        currLen = 0;
      }
    }

    setStreaks(streaks);
  }

  useEffect(() => {
    db.collection("accounts")
      .where("email", "==", user.email)
      .onSnapshot((snapshot) => {
        snapshot.forEach((snap) => {
          let month = date.getMonth();
          setPrivatekey(snap.data().privatekey);
          setAccid(snap.data().accid);
          setDocId(snap.id);
          setPresents(snap.data()[monthNames[month]]);
          setStreakTransaction(snap.data().streakTransaction);
          setTransactionDone(streakTransaction.includes(monthNames[month]));
        });
      });
    getStreaks(presents);

    accid !== "" && fetchBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accid, privatekey, user.email]);

  async function fetchBalance() {
    setAccbal("");
    let data = await axios.post(
      "https://gatekeepers-backend.herokuapp.com/balance",
      {
        id: accid,
        key: privatekey,
      }
    );
    setAccbal(
      (data.data.data.balance._valueInTinybar / 100000000 - 0).toFixed(4)
    );
  }

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setGiftee({ ...giftee, [name]: value });
  };

  async function sendMoney(receiver, money) {
    let data = await axios.post(
      `https://gatekeepers-backend.herokuapp.com/transferMoney`,
      {
        id: accid,
        key: privatekey,
        amount: money,
        giftee: receiver,
      }
    );

    setTransaction(data.data.message);
    fetchBalance();
    setButton(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setButton(true);
    sendMoney(giftee.gifteeAccID, giftee.gifteeSend);
    setGiftee(initialState);
  };

  async function streakTransactionFunc() {
    if (date.getDate() === 29) {
      let data = await axios.post(
        `https://gatekeepers-backend.herokuapp.com/transferMoney`,
        {
          id: process.env.REACT_APP_ACCOUNT_ID,
          key: process.env.REACT_APP_PRIVATE_KEY,
          amount: streaks,
          giftee: accid,
        }
      );

      const variable = db.collection("accounts").doc(docid);

      await variable.update({
        streakTransaction: firebase.firestore.FieldValue.arrayUnion(
          monthNames[date.getMonth()]
        ),
      });

      setTransactionDone(true);
      fetchBalance();
    }
  }

  return (
    <>
      <h2 style={{ postion: "absolute", top: 0, color: "#658ec6" }}>
        Transfer HBAR to your friends/School
      </h2>
      <Container>
        <Form
          style={{
            display: "flex",
            flexDirection: "column",

            justifyContent: "center",
            height: "100%",
          }}
          onSubmit={handleSubmit}
        >
          <h3
            style={{
              color: "#658ec6",
              display: "flex",
              alignItems: "center",
            }}
          >
            Current Balance:{" "}
            {!accbal ? (
              <lottie-player
                src="https://assets8.lottiefiles.com/packages/lf20_fl4lnt7z.json"
                background="transparent"
                loop
                autoplay
                style={{ width: "5%" }}
              />
            ) : (
              `${accbal} ℏ`
            )}
          </h3>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="Enter Account e.g 0.0.34567890"
              style={{
                background: "rgb(101, 223, 201,0.7)",
                borderRadius: "10px",
              }}
              name="gifteeAccID"
              onChange={handleChangeInput}
              value={gifteeAccID}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="text"
              placeholder="Enter Hbar to transfer"
              style={{
                background: "rgb(101, 223, 201,0.7)",
                borderRadius: "10px",
              }}
              onChange={handleChangeInput}
              name="gifteeSend"
              value={gifteeSend}
            />
          </Form.Group>
          <Button type="submit">{button ? "Wait for it" : "Submit"}</Button>
        </Form>
      </Container>
      <Button disabled={transactionDone} onClick={streakTransactionFunc}>
        Streaks {streaks}
      </Button>
      <h5 style={{ position: "relative", color: "#658ec6" }}>
        {transaction
          ? transaction
          : transactionDone
          ? "You have already collected this month streak amount"
          : "You can collect you streak amount at 28th of every month"}
      </h5>
    </>
  );
};

export default Hbar;

const Container = styled.div`
  width: 95%;
  height: 100%;
`;

const Button = styled.button`
  padding: 15px;
  border-radius: 10px;
  color: #426696;
  font-size: 1.2rem;
  background: linear-gradient(to left top, #65dfc9, #6cdbeb);
  transition: 0.3s ease-in-out;
  outline: none;
  border: none;
  transition: all 1s ease;
  cursor: pointer;
  &:hover {
    background: linear-gradient(to right bottom, #26a890, #3fe3fb);
    transition: all 1s ease-in-out;
  }
`;
