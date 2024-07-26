import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { getBarCharts, getDashboardStats, getLineCharts, getPieCharts, } from "../controllers/stats.js";
const app = express.Router();
// GET /api/v1/dashboard/stats
app.get("/stats", adminOnly, getDashboardStats);
// GET /api/v1/dashboard/pie
app.get("/pie", adminOnly, getPieCharts);
// GET /api/v1/dashboard/bar
app.get("/bar", adminOnly, getBarCharts);
// GET /api/v1/dashboard/line
app.get("/line", adminOnly, getLineCharts);
export default app;
//# sourceMappingURL=stats.js.map