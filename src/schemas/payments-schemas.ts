import joi from "joi";

export const ticketIdFormReqQuerySchema = joi.object({
    ticketId: joi.string().required(),
}).required();