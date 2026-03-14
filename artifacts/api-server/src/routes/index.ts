import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import usersRouter from "./users.js";
import coursesRouter from "./courses.js";
import exercisesRouter from "./exercises.js";
import subscriptionsRouter from "./subscriptions.js";
import { paymentsRouter, uploadRouter } from "./payments.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/courses", coursesRouter);
router.use(exercisesRouter);
router.use("/subscriptions", subscriptionsRouter);
router.use("/payments", paymentsRouter);
router.use(uploadRouter);

export default router;
