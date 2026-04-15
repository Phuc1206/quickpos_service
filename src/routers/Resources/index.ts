import billRoute from "@/routers/Resources/bill.route";
import customerRoute from "@/routers/Resources/customer.route";
import menuItemRoute from "@/routers/Resources/MenuItem.route";
import employeeRoute from "@/routers/Resources/employee.route";
import express from "express";
const resourcesRouter = express.Router();

resourcesRouter.use("/employees", employeeRoute);

resourcesRouter.use("/menu-items", menuItemRoute);

resourcesRouter.use("/bills", billRoute);

resourcesRouter.use("/customers", customerRoute);

export default resourcesRouter;
