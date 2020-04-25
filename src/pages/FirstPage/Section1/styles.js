import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 8%;
  position: relative;
  padding: 120px 0 500px;
  @media screen and (max-width: 768px) {
    padding: 120px 32px 120px;
    text-align: center;
  }
`;

export const Img = styled.img`
  margin-bottom: 40px;
  max-width: 216px;
  width: 100%;
`;

export const Title = styled.div`
  margin-bottom: 15px;
  font-size: 50px;
`;

export const Subtitle = styled.div`
  margin-bottom: 40px;
  font-size: 24px;
`;

// export const Input = styled.input`
//   padding: 16px 32px;
//   border-radius: 32px;
//   background-color: #ffffff;
//   color: black;
//   font-size: 18px;
//   width: 350px;
// `;

export const Link = styled.div`
  display: inline-block;
  padding: 12px 24px;
  border-radius: 24px;
  background-color: #33ab3a;
  font-weight: 700;
  text-decoration: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  text-align: center;
`;

export const Arrow = styled.div`
  position: absolute;
  text-align: center;
  font-size: 20px;
  bottom: 300px;
  animation: flashing 2s infinite;

  @media screen and (max-width: 768px) {
    bottom: 0;
  }
`;
