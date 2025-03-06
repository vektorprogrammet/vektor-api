import { z } from "zod";

// modified from https://github.com/colinhacks/zod/discussions/839#discussioncomment-4335236
export function zodEnumFromObjKeys<K extends string>(
	obj: Record<K, unknown>,
): z.ZodEnum<[K, ...K[]]> {
	const [firstKey, ...otherKeys] = Object.keys(obj) as K[];
	return z.enum([firstKey, ...otherKeys]);
}
