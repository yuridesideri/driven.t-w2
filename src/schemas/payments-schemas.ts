import joi from "joi";

export const ticketIdFormReqQuerySchema = joi
  .object({
    ticketId: joi.string().required(),
  })
  .required();

export const paymentSchema = joi.object({
  ticketId: joi.number().required(),
  cardData: joi.object({
    issuer: joi.string(),
    number: joi.string().min(10).max(18),
    name: joi.string(),
    expirationDate: joi.string(),
    cvv: joi.string(),
  }),
}).required();
