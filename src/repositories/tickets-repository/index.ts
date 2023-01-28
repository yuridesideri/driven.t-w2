import { prisma } from "@/config";
import { TicketStatus } from "@prisma/client";

export function getEnrollmentThatHasTicketRepo(userId: number) {
  return prisma.enrollment.findMany({
    where: { userId },
    select: {
      Ticket: { include: { TicketType: true } },
    },
  });
}

export function getTicketTypesRepo() {
  return prisma.ticketType.findMany();
}

export function createTicketRepo(userId: number, ticketTypeId: number) {
  return prisma.ticket.create({
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
      status: TicketStatus.RESERVED,
    },
    include: {
      TicketType: true,
    },
  });
}
