import { prisma } from "@/config";
import { requestError } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares"
import { validateUserTicketExistanceAndOwnership } from "@/repositories/payments-repository";
import { parseCreditCardLastDigits } from "@/utils/creditCard-utils";
import { TicketStatus } from "@prisma/client";
import { Response } from "express"




export async function getPayment(req: AuthenticatedRequest, res: Response): Promise<Response>{
    try {
        const { userId } = req;
        const { ticketId } = req.query as { ticketId: string };
        
        await validateUserTicketExistanceAndOwnership(userId, Number(ticketId));

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




export async function createPayment(req: AuthenticatedRequest, res: Response): Promise<Response>{
    try {
        const { ticketId, cardData } = req.body;
        const { userId } = req;
        console.log("iniciando pagamento")
        await validateUserTicketExistanceAndOwnership(userId, ticketId);

        const {TicketType:{price: ticketPrice}} = await prisma.ticket.findFirst({
            where: {id: ticketId},
            select:{
                TicketType:{
                    select: {price: true}
                }
            }
        })

        const payment = await prisma.payment.create({
            data:{
                ticketId,
                cardIssuer: cardData.issuer,
                cardLastDigits: parseCreditCardLastDigits(cardData.number),
                value: ticketPrice                
            }
        })

        await prisma.ticket.update({
            where: {id: ticketId},
            data: {status: TicketStatus.PAID}
        })

        res.status(200).send(payment);

    }catch (err){
        console.error(err)
        res.status(err.status)
        return res.send(err)
    }
}