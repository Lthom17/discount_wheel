import React, {useState} from 'react';
import {Inner, CloseButton, PopupWrapper} from "./styles";


export default function Popup({children, defaultOpen = true, includeClose = true, popupId, setState}) {
    const [popupOpen, setPopupOpen] = useState(defaultOpen);

    const handleClose = () => {
        setPopupOpen(false);
        setState();
    }

    return (popupOpen) ? (
        <PopupWrapper id={popupId} className='popup-wrapper'>
            <Inner>
                {children}
                {includeClose && (
                    <>
                        <span id="close-popup-help" className="sr-only">
                         Click to close the popup window.
                        </span>
                        <CloseButton onClick={handleClose} aria-describedby='close-popup-help'>X</CloseButton>
                    </>
                )}
            </Inner>
        </PopupWrapper>
    ) : null;
}
