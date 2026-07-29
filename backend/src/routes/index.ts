import express from "express";
import flowRouter from "./flows.routes";
import executionRouter from "./execution.routes";
import userRouter from "./user.routes";
import searchRouter from "./search.routes";
import cors from "cors";
import fileRouter from "./file.routes";
import healthRouter from "./health.routes";

const router = express.Router();

router.use("/api/health", healthRouter);
router.use("/api/flows", flowRouter);
router.use("/api/execution", executionRouter);
router.use("/api/user", userRouter);
router.use("/api/search", searchRouter);
router.use("/api/file", fileRouter);

export default router;
