import fastifyCors from "@fastify/cors";
import fastify from "fastify";

import { companyRoutes } from "./routes/company";
import { employeeRoutes } from "./routes/employee";
import { authRoutes } from "./routes/auth";
import { loadRoutes } from "./routes/load";
import { userRoutes } from "./routes/user";

import { truckRoutes } from "./routes/truck";
import { tripRoutes } from "./routes/trip";
import { tripExpenseRoutes } from "./routes/tripExpense";
import { maintenanceRoutes } from "./routes/maintenance";

const app = fastify({
  logger: true,
});

app.register(fastifyCors, {
  origin: true,
});

app.register(companyRoutes);
app.register(employeeRoutes);
app.register(authRoutes);
app.register(loadRoutes);
app.register(userRoutes);
app.register(truckRoutes);
app.register(maintenanceRoutes);
app.register(tripRoutes);
app.register(tripExpenseRoutes);

export default app;
