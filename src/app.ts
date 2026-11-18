import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import categoryRouter from "./routes/categoryRouter.js";

const app = express();

app.use(express.json());

// ==============================
// Root
// ==============================
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

// ==============================
// Swagger Documentation
// ==============================
app.use("/api-docs", swaggerUi.serveFiles(swaggerSpec));
app.get("/api-docs", swaggerUi.setup(swaggerSpec));
app.get("/api-docs/", swaggerUi.setup(swaggerSpec));

// ==============================
// Routes
// ==============================
app.use("/categories", categoryRouter);

export default app;
