import React, { useState } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import "./Home.css";
import { mobile } from "../Utilities/responsive";
import Video from "../components/Video";
import Modal from "../components/Modal";
import Statistics from "../components/Statistics";
import Hbar from "../components/Hbar";
import Settings from "../components/Settings";
import axios from "axios";

const Home = () => {
  const [user] = useAuthState(auth);
  const [attendence, setAttendence] = useState(true);
  const [stats, setStats] = useState(false);
  const [hbar, setHbar] = useState(false);
  const [settings, setSettings] = useState(false);
  const [fact, setFact] = useState("Click for random facts");

  async function factGenerator() {
    setFact("");
    const result = await axios.get(
      "https://api.api-ninjas.com/v1/facts?limit=1",
      {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": "9YxLHxmkg6g9w/MolF8XeQ==xCWa4ssqaGev9qWx",
        },
      }
    );
    setFact(result.data[0].fact);
    console.log(result.data[0].fact);
  }

  return (
    <Container>
      <Modal />
      <Dashboard>
        <User>
          <Avatar
            src={user.photoURL}
            alt={user.displayName}
            sx={{ width: 70, height: 70 }}
          />
          <h2>{user.displayName}</h2>
        </User>
        <Links>
          <Child
            onClick={() => {
              setStats(false);
              setHbar(false);
              setSettings(false);
              setAttendence(true);
            }}
            style={{
              background:
                attendence && "linear-gradient(to right top, #65dfc9, #6cdbeb)",
            }}
          >
            <h2>Attendence</h2>
          </Child>
          <Child
            onClick={() => {
              setAttendence(false);
              setHbar(false);
              setSettings(false);
              setStats(true);
            }}
            style={{
              background:
                stats && "linear-gradient(to right top, #65dfc9, #6cdbeb)",
            }}
          >
            <h2>Statistics</h2>
          </Child>
          <Child
            onClick={() => {
              setAttendence(false);
              setStats(false);
              setSettings(false);
              setHbar(true);
            }}
            style={{
              background:
                hbar && "linear-gradient(to right top, #65dfc9, #6cdbeb)",
            }}
          >
            <h2>Hbar</h2>
          </Child>
          <Child
            onClick={() => {
              setAttendence(false);
              setStats(false);
              setHbar(false);
              setSettings(true);
            }}
          >
            <h2>Settings</h2>
          </Child>
        </Links>
        <Pro onClick={factGenerator}>
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 0,
            }}
          >
            {!fact ? (
              <lottie-player
                src="https://assets8.lottiefiles.com/packages/lf20_fl4lnt7z.json"
                background="transparent"
                loop
                autoplay
                style={{ width: "10%" }}
              ></lottie-player>
            ) : (
              `${fact}`
            )}
          </p>
        </Pro>
      </Dashboard>
      <Details>
        {attendence && <Video play={attendence} style={{ padding: "10px" }} />}
        {stats && <Statistics />}
        {hbar && <Hbar />}
        {settings && <Settings />}
      </Details>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  display: flex;
  min-height: 80vh;
  ${mobile({ flexDirection: "column", minHeight: "95vh" })}
`;

const Dashboard = styled.div`
  flex: 0.4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    to right bottom,
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.2)
  );
  border-radius: 2rem;
  padding: 5px 0;
  ${mobile({ justifyContent: "flex-start", flex: "0.1", padding: "0" })}
`;

const User = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > h2 {
    color: #426696;
    font-weight: 600;
    opacity: 0.8;
    font-size: 30px;
    padding: 10px;
    text-align: center;
  }
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  height: 100%;
  ${mobile({
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  })}
`;

const Child = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  transition: color 6s ease-in-out;
  border-radius: 10px;
  cursor: pointer;
  & > h2 {
    color: #658ec6;
    font-weight: 500;
    opacity: 0.8;
  }

  &:hover {
    background: linear-gradient(to right top, #65dfc9, #6cdbeb);
  }
  ${mobile({ padding: "10px" })}
`;

const Pro = styled.div`
  background: linear-gradient(to right top, #65dfc9, #6cdbeb);
  border-radius: 2rem;
  color: white;
  padding: 1rem;
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: "100%";
  &:hover {
  }

  ${mobile({ marginTop: "2px" })}
`;

const Details = styled.div`
  flex: 1;
  display: flex;
  margin: 2rem 0rem;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  position: relative;
`;
