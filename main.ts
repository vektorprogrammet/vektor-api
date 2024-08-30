import express from "express";
import { getUsersFromId } from "@db/access/users";
import { SelectUserInterface, InsertUserInterface } from "@db/schema/users";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
	getUsersFromId()
	res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});