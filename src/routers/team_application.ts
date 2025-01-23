import { Router, urlencoded } from "express";

const teamApplicationRouter = Router()

teamApplicationRouter.use(urlencoded({ extended: true }));