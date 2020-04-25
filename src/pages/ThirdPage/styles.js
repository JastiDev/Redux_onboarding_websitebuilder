import styled from "styled-components";
import backgroundImg from "../../assets/images/background.png";
import backgroundMobileImg from "../../assets/images/background-mobile.png";

export const Link = styled.div`
  padding: 12px 24px;
  border-radius: 28px;
  background-color: #33ab3a;
  font-weight: 700;
  text-decoration: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  width: 220px;
  max-width: 320px;
  text-align: center;
  display: inline-block;
  margin-top: 30px;
`;

export const Container = styled.div`
  width: 100%;
`;

export const Background = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: url(${backgroundImg});
  background-size: cover;
  z-index: -1;

  @media screen and (max-width: 768px) {
    background: url(${backgroundMobileImg});
    background-size: cover;
  }
`;
