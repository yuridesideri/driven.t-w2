import { getPayment } from '@/controllers/payments-controller';
import { authenticateToken, validateQuery } from '@/middlewares';
import { ticketIdFormReqQuerySchema } from '@/schemas';
import { Router } from 'express';


export const paymentsRouter = Router();


paymentsRouter.all("/*", authenticateToken).get("/", validateQuery(ticketIdFormReqQuerySchema), getPayment).post("/process")

