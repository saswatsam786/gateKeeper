import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import styled from "styled-components";
import { db, auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import axios from "axios";

const Hbar = () => {
  const [user] = useAuthState(auth);
  const [accid, setAccid] = useState("");
  const [accbal, setAccbal] = useState("");
  const [privatekey, setPrivatekey] = useState("");
  const [button, setButton] = useState(false);
  const [transaction, setTransaction] = useState("");

  const initialState = {
    gifteeAccID: "",
    gifteeSend: "",
  };

  const [giftee, setGiftee] = useState(initialState);

  const { gifteeAccID, gifteeSend } = giftee;

  useEffect(() => {
    db.collection("accounts")
      .where("email", "==", user.email)
      .onSnapshot((snapshot) => {
        snapshot.forEach((snap) => {
          setPrivatekey(snap.data().privatekey);
          setAccid(snap.data().accid);
        });
      });
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

    console.log(data.data.message);
    setTransaction(data.data.message);
    fetchBalance();
    setButton(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setButton(true);
    console.log(giftee.gifteeAccID);
    sendMoney(giftee.gifteeAccID, giftee.gifteeSend);
    setGiftee(initialState);
  };

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
      <h5 style={{ position: "relativex", color: "#658ec6" }}>
        {transaction ? transaction : "hello"}
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
