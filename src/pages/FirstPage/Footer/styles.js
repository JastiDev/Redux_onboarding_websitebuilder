import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120px 0 80px;

  @media screen and (max-width: 768px) {
    padding: 0 32px 40px;
    text-align: center;
  }
`;

export const Img = styled.img`
  margin-bottom: 64px;
  max-width: 216px;
  width: 100%;
`;

export const Subtitle = styled.div`
  margin-bottom: 64px;
  font-size: 20px;
  font-weight: 500;
`;

export const Link = styled.div`
  padding: 16px 32px;
  border-radius: 32px;
  background-color: #33ab3a;
  font-weight: 700;
  text-decoration: none;
  font-size: 18px;
  cursor: pointer;
`;

export const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 360px;

  @media screen and (max-width: 768px) {
    margin-top: 240px;
  }
`;

export const ExternalLink = styled.a`
  padding: 0 40px;
  font-size: 20px;
  text-decoration: none;
  color: white;
  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;
