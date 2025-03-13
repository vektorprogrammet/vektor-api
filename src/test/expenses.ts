import { test } from "node:test";
import { vektorApi } from "@/src/main";
import supertest from "supertest";

const jsonRegex = /json/;

test("GET /expenses", async () => {
	await supertest(vektorApi)
		.get("/expenses")
		.expect(200)
		.expect("Content-Type", jsonRegex);
});

test("GET /expenses/money-amount/unprocessed", async () => {
	await supertest(vektorApi)
		.get("/expenses/money-amount/unprocessed")
		.send({
			startDate: "1976-04-01",
			endDate: "2025-02-01",
		})
		.expect(200)
		.expect("Content-Type", jsonRegex);
});

test("GET /expenses/money-amount/accepted", async () => {
	await supertest(vektorApi)
		.get("/expenses/money-amount/accepted")
		.send({
			startDate: "1976-04-01",
			endDate: "2025-02-01",
		})
		.expect(200)
		.expect("Content-Type", jsonRegex);
});

test("GET /expenses/money-amount/rejected", async () => {
	await supertest(vektorApi)
		.get("/expenses/money-amount/rejected")
		.send({
			startDate: "1976-04-01",
			endDate: "2025-02-01",
		})
		.expect(200)
		.expect("Content-Type", jsonRegex);
});

test("GET /expenses/payback-time/average", async () => {
	await supertest(vektorApi)
		.get("/expenses/payback-time/average")
		.send({
			startDate: "1976-04-01",
			endDate: "2025-02-01",
		})
		.expect(200)
		.expect("Content-Type", jsonRegex);
});
