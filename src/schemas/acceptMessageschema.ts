import {z} from "zod";

export const acceptMessageschema = z.object({
    acceptMassages : z.boolean(),
})