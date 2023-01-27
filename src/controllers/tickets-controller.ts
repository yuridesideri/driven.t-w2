import { AuthenticatedRequest } from '@/middlewares';
import { prisma } from '@/config';
import { Response } from 'express';
import { requestError } from '@/errors';
import httpStatus from 'http-status';

export async function getTickets(req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    const userId = req.userId as number;
    const enrollmentTicket = await prisma.enrollment.findMany({
      where: { userId },
      select: {
        Ticket: { include: { TicketType: true } },
      },
    });
    if (enrollmentTicket.length === 0) throw requestError(404, 'No enrollment found');

    const ticket = enrollmentTicket[0].Ticket[0];

    if (!ticket) throw requestError(httpStatus.NOT_FOUND, 'No ticket found');
    res.status(200).send(ticket);
  } catch (err) {
    console.error(err);
    res.status(err.status);
    return res.send(err.message);
  }
}

export async function getTicketTypes(req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    const ticketTypes = await prisma.ticketType.findMany();
    if (!ticketTypes) throw requestError(404, 'No ticket types found');

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

    const ticket = await prisma.ticket.create({
      data: {
        TicketType: {
          connect: {
            id: ticketTypeId,
          },
        },
        Enrollment: {
          connect: {
            userId,
          },
        },
        status: 'RESERVED',
      },
      include: {
          TicketType: true,
        },
    });
    if (!ticket.ticketTypeId) throw requestError(400, 'No ticket type found');

    return res.status(201).send(ticket);
  } catch (err) {
    console.error(err);
    res.status(err.status || 404);
    return res.send(err);
  }
}
