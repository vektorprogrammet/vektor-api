import { z } from "zod";
import isIBAN from "validator/lib/isIBAN";
import isCurrency from "validator/lib/isCurrency";

export const currencyParser = z.string().refine((input) => {
	return isCurrency(input, {
		symbol: "kr",
		require_symbol: false,
		allow_space_after_symbol: true,
		symbol_after_digits: false,
		allow_negatives: false,
		thousands_separator: ",",
		decimal_separator: ".",
		allow_decimal: true,
		require_decimal: false,
		digits_after_decimal: [2],
		allow_space_after_digits: false,
	});
}, "is not a valid NOK currency");

export const accountNumberParser = z.string().refine((input) => {
	return isIBAN(input, {
		whitelist: ["NO"],
	});
}, "is not a valid norwegian account number");
