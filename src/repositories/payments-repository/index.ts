import { prisma } from "@/config";
import { requestError } from "@/errors";














export async function validateUserTicketExistanceAndOwnership(userId: number, ticketId: number){
    const { userIdFromTicket } = await validateUserTicketExistance(ticketId);
    if (userId !== userIdFromTicket) throw requestError(401, "Unauthorized");
}

async function validateUserTicketExistance(ticketId: number): Promise<{userIdFromTicket: number}>{
    const enrollmentFromUserId = await prisma.ticket.findUnique({
        where: { id: Number(ticketId) },
        select: {
            Enrollment:{
                select:{
                    userId: true
                }
            }
        },
        rejectOnNotFound: () => requestError(404, "Ticket not found")
    });
    const userIdFromTicket = enrollmentFromUserId.Enrollment.userId;
    return { userIdFromTicket };
}