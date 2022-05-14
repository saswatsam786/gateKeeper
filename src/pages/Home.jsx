import React from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import "./Home.css";
import { mobile } from "../Utilities/responsive";
import Video from "../components/Video";
import Modal from "../components/Modal";

const Home = () => {
  const [user] = useAuthState(auth);
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
          <Child>
            <img src="./images/twitch.png" alt="" />
            <h2>Streams</h2>
          </Child>
          <Child>
            <img src="./images/steam.png" alt="" />
            <h2>Games</h2>
          </Child>
          <Child>
            <img src="./images/upcoming.png" alt="" />
            <h2>New</h2>
          </Child>
          <Child>
            <img src="./images/library.png" alt="" />
            <h2>Library</h2>
          </Child>
        </Links>
        <Pro>
          <h2>Join pro for free games.</h2>
        </Pro>
      </Dashboard>
      <Details>
        <Video />
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
  ${mobile({ marginTop: "2px" })}
`;

const Details = styled.div`
  flex: 1;
  display: flex;
  margin: 2rem 0rem;
  padding: 1rem 5rem;
  align-items: center;
  flex-direction: column;
`;
