import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { companyRoutes } from "./routes/company";
import { employeeRoutes } from "./routes/employee";
import { authRoutes } from "./routes/auth";

const app = fastify({
  logger: true
});

app.register(fastifyCors, {
  origin: true
})

app.register(companyRoutes)
app.register(employeeRoutes)
app.register(authRoutes);


export default app