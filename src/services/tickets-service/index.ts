import { requestError } from "@/errors";
import { createTicketRepo, getEnrollmentThatHasTicketRepo, getTicketTypesRepo } from "@/repositories/tickets-repository";
import httpStatus from "http-status";

export async function getTicketsSvc(userId: number) {
  const enrollmentThatHasTicket = await getEnrollmentThatHasTicketRepo(userId);
  if (enrollmentThatHasTicket.length === 0) throw requestError(404, "No enrollment found");
  const ticket = enrollmentThatHasTicket[0].Ticket[0];
  if (!ticket) throw requestError(httpStatus.NOT_FOUND, "No ticket found");
  return ticket;
}

export async function getTicketTypesSvc() {
  const ticketTypes = await getTicketTypesRepo();
  return ticketTypes;
}

export async function postTicketSvc(userId: number, ticketTypeId: number) {
  const ticket = await createTicketRepo(userId, ticketTypeId);
  if (!ticket.ticketTypeId) throw requestError(400, "No ticket type found");
  return ticket;
}
