import React from 'react';
import {createRoot} from 'react-dom/client';
import WheelPopUp from "./components/WheelPopUp";

export const MAX_PARTICIPANTS = 18;

document.addEventListener('DOMContentLoaded', () => {

  const mountNodeDiscountWheel = document.getElementById('react-discount-wheel');

  if (mountNodeDiscountWheel) {
    const rootMain = createRoot(mountNodeDiscountWheel);
    rootMain.render(
        <WheelPopUp/>
    );
  }
});

