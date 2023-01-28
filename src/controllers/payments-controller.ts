import { AuthenticatedRequest } from "@/middlewares";
import { getPaymentsSvc, postPaymentsSvc } from "@/services/payments-service";
import { Response } from "express";

export async function getPayment(req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    const { userId } = req;
    const { ticketId } = req.query as { ticketId: string };
    const payment = await getPaymentsSvc(userId, Number(ticketId));
    res.status(200).send(payment);
  }catch (err) {
    res.status(err.status);
    return res.send(err);
  }
}

export async function createPayment(req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    const { ticketId, cardData } = req.body;
    const { userId } = req;
    const payment = await postPaymentsSvc(userId, ticketId, cardData);
    res.status(200).send(payment);
  }catch (err) {
    res.status(err.status);
    return res.send(err);
  }
}
