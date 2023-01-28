import { createPayment, getPayment } from "@/controllers/payments-controller";
import { authenticateToken, validateBody, validateQuery } from "@/middlewares";
import { paymentSchema, ticketIdFormReqQuerySchema } from "@/schemas";
import { Router } from "express";

export const paymentsRouter = Router();

paymentsRouter.all("/*", authenticateToken).get("/", validateQuery(ticketIdFormReqQuerySchema), getPayment).post("/process", validateBody(paymentSchema), createPayment);

