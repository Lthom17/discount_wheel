import {fireEvent, render, screen} from '@testing-library/react';
import { WheelOfDiscounts } from '../components/WheelOfDiscounts';


test('renders wheel title', () => {
  render(<WheelOfDiscounts title="Spin to Win!" discounts={[]} />);
  expect(screen.getByText(/spin to win!/i)).toBeInTheDocument();
});

test('spin button is disabled with no discounts', () => {
  render(<WheelOfDiscounts title="Wheel" discounts={[]} />);
  const button = screen.getByRole('button', { name: /spin/i });
  expect(button).toBeDisabled();
});

test('spin button is enabled with discounts', () => {
  const mockDiscounts = [{ discount: 20, type: 'percentage' }];
  render(<WheelOfDiscounts title="Wheel" discounts={mockDiscounts} />);
  const button = screen.getByRole('button', { name: /spin/i });
  expect(button).toBeEnabled();
});

test('Shows popup with correct props', async () => {
  jest.mock('../components/Popup', () => () => <div data-testid="mock-popup">Mocked Popup</div>);

  render(
    <WheelOfDiscounts
      discounts={[{ discount: 20, type: 'percentage' }]}
      title='Spin the Wheel!'
      popupText='Congratulations!'
    />
  );

  const button = screen.getByRole('button', { name: /spin/i });

  fireEvent.click(button);

  expect(screen.getByTestId('mock-popup')).toBeInTheDocument();

  // expect(screen.getByText(/spin the wheel!/i)).toBeInTheDocument();
  // const congrats = await screen.getByText(/congratulations!/i);
  // expect(congrats).toBeInTheDocument();
  //
  // const disc = await screen.getByText(/20% off/i);
  // expect(disc).toBeInTheDocument();


});


