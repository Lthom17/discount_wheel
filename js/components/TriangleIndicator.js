import React from 'react';
import styled from "styled-components";

const TriangleIndicator = styled.svg`
  position: absolute;
  //top: 58px;
  //left: 50%;
  //width: 40px;
  //height: 30px;
  transform: translateX(-50%);
  z-index: 10;
  pointer-events: none;
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.4));
`;

const Triangle = () => (
  <TriangleIndicator
      className="triangle-indicator"
      viewBox="0 0 30 20"
      role="img"
      aria-label={`Discount wheel indicator used to select coupon segment`}
  >
    <polygon points="15,20 0,0 30,0" fill="#5a5a5a" />
  </TriangleIndicator>
);

export default Triangle;
