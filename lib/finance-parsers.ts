import validator from "validator";
import { z } from "zod";

export const currencyParser = z.string().refine((input) => {
	return validator.isCurrency(input, {
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

export const norwegianIbanParser = z.string().refine((input) => {
	return validator.isIBAN(input, {
		whitelist: ["NO"],
	});
}, "is not a valid norwegian account number");

export const norwegianBankAccountNumberParser = z
	.string()
	.length(11)
	.transform((string) => `NO93${string}`)
	.pipe(norwegianIbanParser);
