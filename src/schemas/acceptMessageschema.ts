import {z} from "zod";

export const acceptMessageschema = z.object({
    acceptMessages : z.boolean(),
})