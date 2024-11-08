import { z } from "zod";

export const recieptIdValidator = z.object({
	recieptId: z.coerce
		.number()
		.finite()
		.safe()
		.positive()
		.int()
		.describe("Id of reciept requested"),
});
