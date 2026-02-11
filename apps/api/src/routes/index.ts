import { FastifyInstance } from "fastify";
import txRoutes from "./tx.routes";
import statusController from "../controllers/status.controller";

export default async function routes(fastify: FastifyInstance) {
  fastify.register(txRoutes, { prefix: "/tx" });
  fastify.get("/status", statusController.checkStatus);
}
