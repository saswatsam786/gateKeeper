import React from "react";
import styled from "styled-components";

import Logo from "../Utilities/Logo.png";

const Header = () => {
  return (
    <NavBar>
      <NavUl>
        <Navli>
          <ImageLogo src={Logo} alt="Logo" />
        </Navli>
        <Navli login onClick={() => console.log(2)}>
          Login now
        </Navli>
      </NavUl>
    </NavBar>
  );
};

export default Header;

const NavBar = styled.nav`
  padding: 40px;
`;

const NavUl = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Navli = styled.li`
  ${(props) =>
    props.login && {
      padding: "10px",
      borderRadius: "10px",
      color: "#426696",
      background: `linear-gradient(
    to left top,
    #65dfc9,
    #6cdbeb
  )`,
      transition: "0.3s ease-in-out",
    }}
  cursor: pointer;

  &:hover {
    background: ${(props) =>
      props.login &&
      `linear-gradient(
    to right bottom,
    #26a890, #3fe3fb
  )`};
  }
`;

const ImageLogo = styled.img`
  max-width: 140px;
  object-fit: contain;
  border-radius: 20px;
`;
