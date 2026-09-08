import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardAuthRouter from "./dashboard-auth";
import gostoMenuRouter from "./gosto-menu";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardAuthRouter);
router.use(gostoMenuRouter);

export default router;
