import { requestError } from "@/errors";
import { createPaymentAndPayTicketRepo, userIdFromEnrollmentRepo, getPaymentsRepo, getTicketPriceRepo } from "@/repositories/payments-repository";
import { parseCreditCardLastDigits } from "@/utils/creditCard-utils";

export async function getPaymentsSvc(userId: number, ticketId: number) {
  await validateUserTicketExistanceAndOwnershipSvc(userId, ticketId);
  const payment = await getPaymentsRepo(ticketId);
  return payment;
}

export async function postPaymentsSvc(userId: number, ticketId: number, cardData: { issuer: string; number: string; }) {
  await validateUserTicketExistanceAndOwnershipSvc(userId, ticketId);
  const { TicketType: { price: ticketPrice } } = await getTicketPriceRepo(ticketId);
  const cardDataForRepo = {
    issuer: cardData.issuer,
    lastDigits: parseCreditCardLastDigits(cardData.number),
    ticketPrice: ticketPrice
  };
  const { Payment } = await createPaymentAndPayTicketRepo(ticketId, cardDataForRepo);
  return Payment[0];
}

async function validateUserTicketExistanceAndOwnershipSvc(userId: number, ticketId: number) {
  const { userIdFromTicket } = await validateUserTicketExistanceSvc(ticketId);
  if (userId !== userIdFromTicket) throw requestError(401, "Unauthorized");
}

async function validateUserTicketExistanceSvc(ticketId: number): Promise<{userIdFromTicket: number}> {
  const userIdFromEnrollment = await userIdFromEnrollmentRepo(ticketId);
  const userIdFromTicket = userIdFromEnrollment.Enrollment.userId;
  return { userIdFromTicket };
}
