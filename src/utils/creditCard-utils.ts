
export function parseCreditCardLastDigits(cardNumber: string): string {
  const cardNumberString = cardNumber.slice(-4);
  return cardNumberString;
}
