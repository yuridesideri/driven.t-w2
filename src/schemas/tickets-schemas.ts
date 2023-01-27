import joi from "joi";

export const ticketTypeIdSchema = joi.object({
    ticketTypeId: joi.number().required(),
}).required();