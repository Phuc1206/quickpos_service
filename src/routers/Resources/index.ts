import employeeRoute from "@/routers/Resources/employee.route";
import express from "express";
const resourcesRouter = express.Router();

resourcesRouter.use("/employees", employeeRoute);

export default resourcesRouter;
