import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  BadRequestError,
  CryptoValidationError,
  DecryptionError,
} from "../utils/error";
import { AppError } from "../utils/error/app.error";

export default fp(async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler(
    (error: Error, _request: FastifyRequest, reply: FastifyReply) => {
      fastify.log.error(error);

      // Known crypto tampering errors
      if (error instanceof BadRequestError) {
        const appError = new AppError(error.message, 400, "BAD_REQUEST_ERROR");

        return reply.status(appError.statusCode).send({
          error: {
            code: appError.code,
            message: appError.message,
          },
        });
      }

      if (error instanceof CryptoValidationError) {
        const appError = new AppError(
          error.message,
          400,
          "CRYPTO_VALIDATION_ERROR",
        );

        return reply.status(appError.statusCode).send({
          error: {
            code: appError.code,
            message: appError.message,
          },
        });
      }

      if (error instanceof DecryptionError) {
        const appError = new AppError(
          "Invalid or tampered data",
          400,
          "DECRYPTION_FAILED",
        );

        return reply.status(appError.statusCode).send({
          error: {
            code: appError.code,
            message: appError.message,
          },
        });
      }

      // Unknown Errors
      return reply.status(500).send({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        },
      });
    },
  );
});
