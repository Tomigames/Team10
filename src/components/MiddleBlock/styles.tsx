import styled from "styled-components";

export const MiddleBlockSection = styled("section")`
  background:rgb(232, 131, 81);
  position: relative;
  text-align: center;
  display: flex;
  justify-content: center;

  @media screen and (max-width: 2024px) {
    padding: 8.5rem 1 6rem;
  }
`;

export const Content = styled("p")`
  padding: 0.95rem 0 0.75rem;
`;

export const ContentWrapper = styled("div")`


  @media only screen and (max-width: 1068px) {
    max-width: 150%;
  }
`;
