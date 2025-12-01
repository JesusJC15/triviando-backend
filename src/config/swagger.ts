import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { Express } from "express";
import logger from "../utils/logger";

export const setupSwagger = (app: Express) => {
  const swaggerPath = path.join(__dirname, "../docs/openapi.yaml");
  const swaggerDocument = YAML.load(swaggerPath);

  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  logger.info("Swagger available at /api/v1/docs");
};