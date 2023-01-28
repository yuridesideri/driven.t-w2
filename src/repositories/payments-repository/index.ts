import { prisma } from '@/config';
import { requestError } from '@/errors';
import { TicketStatus } from '@prisma/client';

export function getPaymentsRepo(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId: Number(ticketId),
    },
  });
}

export function userIdFromEnrollmentRepo(ticketId: number) {
  return prisma.ticket.findUnique({
    where: { id: Number(ticketId) },
    select: {
      Enrollment: {
        select: {
          userId: true,
        },
      },
    },
    rejectOnNotFound: () => requestError(404, 'Ticket not found'),
  });
}


export function getTicketPriceRepo(ticketId: number) {
  return prisma.ticket.findFirst({
    where: { id:ticketId },
    select: {
      TicketType: {
        select: { price: true },
      },
    },
  });
}


export function createPaymentAndPayTicketRepo(ticketId: number, cardData: { issuer: string; lastDigits: string; ticketPrice: number}) {
  return prisma.ticket.update({
            where: {id: ticketId},
            data: {
                status: TicketStatus.PAID,
                Payment: {
                    create:[
                        {
                            cardIssuer: cardData.issuer,
                            cardLastDigits: cardData.lastDigits,
                            value: cardData.ticketPrice                
                        }
                    ]
                }
            },
            select: {
                Payment: true
            }
        })
}