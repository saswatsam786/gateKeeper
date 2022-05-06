import React from "react";
import RightImage from "../Utilities/RightImage.jpg";
import Header from "../components/Header";
import styled from "styled-components";
import { mobile } from "../Utilities/responsive";
import { auth, provider } from "../firebaseConfig";

const Home = () => {
  const signin = async (e) => {
    e.preventDefault();
    provider.setCustomParameters({ prompt: "select_account" });
    await auth
      .signInWithPopup(provider)
      .catch(alert)
      .then(() => {
        const user = auth.currentUser;
        console.log(user.phoneNumber);
      });
  };

  return (
    <Container>
      {/* Home Container */}
      <HomeCon>
        {/* inner glass box */}
        <MainBox>
          <Header />
          <MainContent>
            <MainText>
              <h1>
                Gate <span>Keeper</span>
              </h1>
              <h2>One of a kind attendence management system</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni
                tempora error consequatur veniam soluta cumque ducimus! Soluta
              </p>
              <Button onClick={signin}>Login Now</Button>
            </MainText>
            <MainImage>
              <ImageRight src={RightImage} alt="Right" />
            </MainImage>
          </MainContent>
        </MainBox>
      </HomeCon>
      <Circle top="4%" right="2%"></Circle>
      <Circle bottom="4%" left="2%"></Circle>
    </Container>
  );
};

export default Home;

const Container = styled.section``;

const HomeCon = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to right top, #65dfc9, #6cdbeb);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MainBox = styled.div`
  background: white;
  width: 80%;
  min-height: 80vh;
  background: linear-gradient(
    to right bottom,
    rgba(255, 255, 255, 0.7),
    rgba(255, 255, 255, 0.3)
  );
  border-radius: 1rem;
  backdrop-filter: blur(0.5rem);
  z-index: 4;
  ${mobile({ width: "90%" })}
`;

const MainContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
  ${mobile({ flexDirection: "column-reverse" })}
`;

const MainText = styled.div`
  flex: 1;
  & > h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }
  & > h2 {
    font-size: 2rem;
    font-weight: 200;
  }

  & > p {
    font-size: 1rem;
    font-weight: 100;
    margin: 18px 0 40px;
  }

  &:after {
    content: "";
    width: 5px;
    height: 20%;
    background: #089d8f;
    position: absolute;
    left: 2.4rem;
    top: 12rem;
    ${mobile({ bottom: "11rem" })}
  }

  ${mobile({ marginTop: "10px" })}
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

const MainImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImageRight = styled.img`
  width: 95%;
  border-radius: 10px;
`;

const Circle = styled.div`
  background: white;
  height: 15rem;
  width: 15rem;
  border-radius: 50%;
  position: absolute;
  background: linear-gradient(
    to right bottom,
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 0.2)
  );
  z-index: 2;
  top: ${(props) => props.top};
  right: ${(props) => props.right};
  bottom: ${(props) => props.bottom};
  left: ${(props) => props.left};
`;

// const Circle = styled.div``;
