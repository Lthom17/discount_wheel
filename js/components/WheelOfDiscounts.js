import React, {useEffect, useRef, useState} from 'react';
import confetti from 'canvas-confetti';
import {ButtonsContainer} from "./styles";
import '../../css/DiscountWheelItems.css';

import {setDiscountText} from './utils';
import {Button} from './styles';
import Triangle from "./TriangleIndicator";
import {getUniqueCoupon} from "./CreateCoupon";
import Popup from "./Popup";


const colors = [
    '#7a0019', //Maroon
    '#ffcc33', //Gold
];

export const WheelOfDiscounts = ({discounts, title, popupText, extraText, onSpin}) => {
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(270);
    const [hasClicked, setHasClicked] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [wheelStatus, setWheelStatus] = useState('');
    const [copyStatus, setCopyStatus] = useState('');
    const [buttonText, setButtonText] = useState('');
    const [codeCopied, setCodeCopied] = useState(false);
    const spinDirection = 1;

    const [showPopup, setShowPopup] = useState(false);
    const [popupWinner, setPopupWinner] = useState(null);

    const canvasRef = useRef(null);
    const numSectors = discounts.length;

    useEffect(() => {
        if (canvasRef.current) {
            drawWheel();
        }
    }, [discounts, rotation]);


    const darkenColor = (color, amount) => {
        let r = parseInt(color.slice(1, 3), 16);
        let g = parseInt(color.slice(3, 5), 16);
        let b = parseInt(color.slice(5, 7), 16);

        r = Math.max(0, r - amount);
        g = Math.max(0, g - amount);
        b = Math.max(0, b - amount);

        return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
    };

    const drawWheel = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Get the device pixel ratio, falling back to 1
        const dpr = window.devicePixelRatio || 1;

        // Save the CSS size
        const cssWidth = canvas.clientWidth;
        const cssHeight = canvas.clientHeight;

        // Set the actual canvas size in device pixels
        canvas.width = cssWidth * dpr;
        canvas.height = cssHeight * dpr;

        // Scale the context so drawing uses CSS pixel coordinates
        ctx.scale(dpr, dpr);

        const radius = cssWidth / 2;
        const sliceAngle = (2 * Math.PI) / numSectors;

        // Clear canvas
        ctx.clearRect(0, 0, cssWidth, cssHeight);

        // Draw the wheel
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(rotation * (Math.PI / 180));

        for (let i = 0; i < numSectors; i++) {
            const startAngle = i * sliceAngle;
            const endAngle = (i + 1) * sliceAngle;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = darkenColor(colors[i % colors.length], 30);
            ctx.fill();

            // Draw label
            ctx.save();
            ctx.rotate((startAngle + endAngle) / 2);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            const fontSize = Math.max(16, radius * 0.08); // 8% of radius, min 16px
            ctx.font = `${fontSize}px Rubik, sans-serif`;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.shadowBlur = 3;
            ctx.fillText(setDiscountText(discounts[i]) || '', radius * 0.5, 0);
            ctx.restore();
        }

        ctx.restore();
    };

    const startSpin = () => {
        if (spinning) return;
        setSpinning(true);
        setHasClicked(true);
        setWheelStatus('Discount Wheel is spinning.')


        const numFullRotations = Math.random() * 5 + 5;
        const totalRotation = numFullRotations * 360;

        const finalRotation = (rotation + spinDirection * totalRotation) % 360;
        const spinDuration = 6000;
        const easing = (t) => 1 - Math.pow(1 - t, 3);

        let startTime;

        const animate = (time) => {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const t = Math.min(elapsed / spinDuration, 1);
            const easeT = easing(t);
            const currentRotation = rotation + spinDirection * totalRotation * easeT;

            setRotation(currentRotation);

            if (elapsed < spinDuration) {
                requestAnimationFrame(animate);
            } else {
                setSpinning(false);
                determineWinner(finalRotation);
            }
        };

        requestAnimationFrame(animate);
    };

    const determineWinner = async (finalRotation) => {
        const sliceAngle = 360 / numSectors;

        const pointerAngle = 270;

        const winningAngle = ((pointerAngle - finalRotation) % 360 + 360) % 360;
        const index = Math.floor(winningAngle / sliceAngle);

        // Set the winner and show the popup
        const winner = discounts[index];
        setPopupWinner(setDiscountText(winner));
        const code = await getUniqueCoupon(winner?.discount, winner?.promotion);
        setCouponCode(code);
        setButtonText(`Click to Copy: ${code}`)
        setShowPopup(true);

    };

    useEffect(() => {
        if (showPopup) {
            setWheelStatus(`The wheel has stopped. You won ${popupWinner}.`)
            startConfetti();
            const timer = setTimeout(() => {
                setShowPopup(false);
                // set that user has spun the wheel in local storage
                onSpin();
            }, 60000); // Hide popup after 60 seconds

            return () => clearTimeout(timer);
        }
    }, [showPopup]);

    const startConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: {y: 0.6},
        });
    };

    return (
        <div className='discount-wheel-items'>
            <div className='discount-wheel-title'>{title}</div>
            <div
                id="wheel-status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {wheelStatus}
            </div>
            <Triangle/>
            <canvas
                ref={canvasRef}
                role="img"
                aria-label={`Discount wheel with ${discounts.length} segments showing available coupon codes`}
                className='discount-wheel'
                width={200}
                height={200}
            />
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {wheelStatus}
            </div>
            <ButtonsContainer>
                <Button
                    onClick={startSpin}
                    disabled={discounts.length === 0 || spinning || hasClicked}
                    aria-label='Button to spin the wheel.'
                >
                    Spin
                </Button>
            </ButtonsContainer>
            {showPopup && popupWinner && (
                <Popup includeClose={false} popupId='inner-popup'>
                    <h2>{popupText}</h2>
                    <h3>{popupWinner}</h3>
                    <p className='cc-text'>Coupon Code:</p>
                    <div aria-live="polite" aria-atomic="true" className="sr-only">
                        {copyStatus}
                    </div>
                    <button
                        className='cc-button'
                        type="button"
                        style={{color: codeCopied ? 'green' : '#406EB5'}}
                        onClick={() => {
                            navigator.clipboard.writeText(couponCode);
                            setCopyStatus(`Coupon code ${couponCode} copied to clipboard.`);
                            setButtonText(`Code Copied! ${couponCode}`)
                            setCodeCopied(true);
                        }}
                        aria-label={`Copy coupon code ${couponCode} to clipboard`}
                    >
                        {buttonText}
                    </button>
                    <p className='disclaimer'>{extraText}</p>
                </Popup>
            )}
        </div>
    );
};
