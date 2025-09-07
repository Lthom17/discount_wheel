import '@testing-library/jest-dom';

//Mocking the getContext for rendering the discount wheel
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = () => {
    return {
      fillRect: () => {},
      clearRect: () => {},
      getImageData: () => ({ data: [] }),
      putImageData: () => {},
      createImageData: () => [],
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      fillText: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      strokeRect: () => {},
      shadowColor: '',
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 0,
      font: '',
      textAlign: '',
      textBaseline: '',
    };
  };
});
