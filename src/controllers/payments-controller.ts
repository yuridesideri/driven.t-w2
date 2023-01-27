import { prisma } from "@/config";
import { requestError } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares"
import { Response } from "express"




export async function getPayment(req: AuthenticatedRequest, res: Response): Promise<Response>{
    try {
        const { userId } = req;
        const { ticketId } = req.query as { ticketId: string };
        const userIdFromTicket = await prisma.ticket.findUnique({
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

        if (userId !== userIdFromTicket.Enrollment.userId) throw requestError(401, "Unauthorized");

        const payment = await prisma.payment.findFirst({
            where: {
                ticketId: Number(ticketId)
            }
        })
        res.status(200).send(payment)
    }catch (err){
        console.error(err)
        res.status(err.status)
        return res.send(err)
    }
}