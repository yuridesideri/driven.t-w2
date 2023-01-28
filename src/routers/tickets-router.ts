import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { createTicket, getTickets, getTicketTypes } from "@/controllers/tickets-controller";
import { ticketTypeIdSchema } from "@/schemas";

export const ticketsRouter = Router();

ticketsRouter.all("/*", authenticateToken).get("/", getTickets).get("/types", getTicketTypes).post("/", validateBody(ticketTypeIdSchema), createTicket);
