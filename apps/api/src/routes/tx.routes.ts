import { FastifyInstance } from "fastify";
import * as txController from "../controllers/tx.controller";

export default async function txRoutes(fastify: FastifyInstance) {
  fastify.post("/tx/encrypt", txController.encrypt);
}
