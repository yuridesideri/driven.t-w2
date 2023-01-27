import { authenticateToken } from '@/middlewares';
import { Router } from 'express';


export const paymentsRouter = Router();


paymentsRouter.all("/*", authenticateToken).get("/").post("/process")

