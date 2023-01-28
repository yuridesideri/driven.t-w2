import { AuthenticatedRequest } from '@/middlewares';
import { prisma } from '@/config';
import { Response } from 'express';
import { requestError } from '@/errors';
import httpStatus from 'http-status';
import { TicketStatus } from '@prisma/client';
import { getTicketsSvc, getTicketTypesSvc, postTicketSvc } from '@/services/tickets-service';

export async function getTickets(req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    const userId = req.userId as number;
    const ticket = await getTicketsSvc(userId);
    res.status(200).send(ticket);
  } catch (err) {
    console.error(err);
    res.status(err.status);
    return res.send(err.message);
  }
}

export async function getTicketTypes(req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    const ticketTypes = await getTicketTypesSvc();
    res.status(200).send(ticketTypes);
  } catch (err) {
    console.error(err);
    res.status(err.status);
    return res.send(err.message);
  }
}

export async function createTicket(req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    const { userId } = req;
    const { ticketTypeId } = req.body as { ticketTypeId: number };

    
    const ticket = await postTicketSvc(userId, ticketTypeId)
    return res.status(201).send(ticket);
  } catch (err) {
    console.error(err);
    res.status(err.status || 404);
    return res.send(err);
  }
}
