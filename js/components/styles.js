import styled from 'styled-components';

export const Section = styled.section`
  width: 40%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Button = styled.button`
  padding: 1rem;
  margin: 0.5rem;
  background-color: rgb(90,90,90);
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1.2rem;
  font-weight: bold;

  // hover effect
  &:hover {
    background-color: #61dafb;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  padding: 0.8rem;
  font-size: 1.2rem;
  margin: 0.5rem;
  width: 60%;
`;

export const EditableWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  justify-content: center;

  &:hover {
    background-color: #f0f0f0;
    color: black;
  }

  h1 {
    margin: 0;
    padding-right: 10px;
  }
`;

export const EditIcon = styled.div`
  font-size: 20px;
  color: gray;
  margin-left: 8px;
  opacity: 0.8;

  ${EditableWrapper}:hover & {
    color: black;
  }
`;

export const PopupWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  color: rgb(90, 90, 90);
  padding: 1rem 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  z-index: 1000;
  animation: popin 1s ease-out;

  @keyframes popin {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

export const Inner = styled.div`
  position: relative;
`;

export const CloseButton = styled.button`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: rgb(90, 90, 90);
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  color: #7a0019;
  padding: 10px;
`;

