import express from "express";
import helmet from "helmet";
import cors from "cors";
import { AuthController } from "./modules/auth/auth.controller";
import { setupSwagger } from "./config/swagger";
import { CollectorController } from "./modules/collectors/collectors.controller";
import { AdminController } from "./modules/admin/controllers/admin.controller";
import { CenterController } from "./modules/centers/centers.controller";
import { DropController } from "./modules/drops/drops.controller";
import { EventsController } from "./modules/events/events.controller";
import { CenterManagementController } from "./modules/admin/controllers/center.controller";
import { CollectorManagementController } from "./modules/admin/controllers/collector.controller";
import { AdminManagementController } from "./modules/admin/controllers/admin-mgt.controller";
import cookieParser from "cookie-parser";
import { DashboardController } from "./modules/dashboard/dashboard.controller";
import { LogsController } from "./modules/activity_logs/Logs.controller";
import { AdminEmailController } from "./modules/admin/controllers/admin-email.controller";
import { AdminDownloadController } from "./modules/admin/controllers/download-report.controller";
import { NotificationController } from "./modules/notifications/notifications.controller";

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(helmet());
  app.use(cookieParser());
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:5174"],
      credentials: true,
    }),
  );

  // app.options(
  //   "*",
  //   cors({
  //     origin: "http://localhost:5173",
  //     credentials: true,
  //   })
  // );

  // Swagger UI
  setupSwagger(app);

  // Routes
  app.use("/api/auth", AuthController);
  app.use("/api/admin", AdminController);
  app.use("/api/admin/dashboard", DashboardController);
  app.use("/api/collector", CollectorController);
  app.use("/api/center", CenterController);
  app.use("/api/drop", DropController);
  app.use("/api/events", EventsController);
  app.use("/api/admin/center-mgt", CenterManagementController);
  app.use("/api/admin/collector-mgt", CollectorManagementController);
  app.use("/api/admin/admin-mgt", AdminManagementController);
  app.use("/api/admin", LogsController);
  app.use("/api/admin", AdminEmailController);
  app.use("/api/admin", AdminDownloadController);
  app.use("/api/notification", NotificationController);
  app.get("/health", (req, res) => res.json({ status: "ok" }));

  return app;
};
