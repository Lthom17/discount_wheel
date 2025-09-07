import React, {useEffect, useState, useRef} from 'react';
import {createDeals, getDiscountWheelSettings} from './utils';
import {WheelOfDiscounts} from "./WheelOfDiscounts";
import Popup from "./Popup";

export default function WheelPopUp() {
    const [discountData, setDiscountData] = useState([]);
    const [popupTitle, setPopupTitle] = useState('');
    const [congratsText, setCongratsText] = useState('');
    const [disclaimer, setDisclaimer] = useState('');
    const [showWheelPopup, setShowWheelPopup] = useState(false);
    const hasSpun = useRef(false);

    useEffect(() => {
        const storedValue = localStorage.getItem('wheelSpun');
        if (storedValue === 'true') {
            hasSpun.current = true;
        }
    }, []);

    useEffect(() => {
        const {
            popupTitleSetting,
            congratsTextSetting,
            slicesSetting,
            disclaimerTextSetting
        } = getDiscountWheelSettings();
        setDiscountData(slicesSetting);
        setPopupTitle(popupTitleSetting);
        setCongratsText(congratsTextSetting);
        setDisclaimer(disclaimerTextSetting);
    }, []);

    const deals = createDeals(discountData);

    useEffect(() => {
        if(!hasSpun.current) {
            setTimeout(() => {
                if (deals && deals.length > 0) {
                    setShowWheelPopup(true);
                }
            }, 3000);
        } else {
            setShowWheelPopup(false);
        }

    }, [discountData]);

    const handleSpin = () => {
        hasSpun.current = true;
        localStorage.setItem('wheelSpun', 'true');
        setShowWheelPopup(false);
    };

    return (
        <div>
            {showWheelPopup &&
                <Popup setState={handleSpin}>
                    <WheelOfDiscounts discounts={deals} title={popupTitle} popupText={congratsText}
                                      extraText={disclaimer} onSpin={handleSpin}/>
                </Popup>
            }
        </div>
    )

}
