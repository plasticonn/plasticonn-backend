"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const auth_controller_1 = require("./modules/auth/auth.controller");
const swagger_1 = require("./config/swagger");
const collectors_controller_1 = require("./modules/collectors/collectors.controller");
const admin_controller_1 = require("./modules/admin/controllers/admin.controller");
const centers_controller_1 = require("./modules/centers/centers.controller");
const drops_controller_1 = require("./modules/drops/drops.controller");
const events_controller_1 = require("./modules/events/events.controller");
const center_controller_1 = require("./modules/admin/controllers/center.controller");
const collector_controller_1 = require("./modules/admin/controllers/collector.controller");
const admin_mgt_controller_1 = require("./modules/admin/controllers/admin-mgt.controller");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dashboard_controller_1 = require("./modules/dashboard/dashboard.controller");
const Logs_controller_1 = require("./modules/activity_logs/Logs.controller");
const admin_email_controller_1 = require("./modules/admin/controllers/admin-email.controller");
const download_report_controller_1 = require("./modules/admin/controllers/download-report.controller");
const notifications_controller_1 = require("./modules/notifications/notifications.controller");
const website_controller_1 = require("./modules/website/website.controller");
const gallery_controller_1 = require("./modules/gallery/gallery.controller");
const partners_controller_1 = require("./modules/partners/partners.controller");
const blog_controller_1 = require("./modules/blogs/blog.controller");
const leaderboard_controller_1 = require("./modules/leaderboard/leaderboard.controller");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, helmet_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.use((0, cors_1.default)({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://plasticonn-admin.vercel.app",
            "https://plasticonn-web-app.vercel.app",
            "https://plasticonn-website.vercel.app",
        ],
        credentials: true,
    }));
    // Swagger UI
    (0, swagger_1.setupSwagger)(app);
    // Routes
    app.use("/api/auth", auth_controller_1.AuthController);
    app.use("/api/admin", admin_controller_1.AdminController);
    app.use("/api/admin/dashboard", dashboard_controller_1.DashboardController);
    app.use("/api/collector", collectors_controller_1.CollectorController);
    app.use("/api/center", centers_controller_1.CenterController);
    app.use("/api/drop", drops_controller_1.DropController);
    app.use("/api/events", events_controller_1.EventsController);
    app.use("/api/admin/center-mgt", center_controller_1.CenterManagementController);
    app.use("/api/admin/collector-mgt", collector_controller_1.CollectorManagementController);
    app.use("/api/admin/admin-mgt", admin_mgt_controller_1.AdminManagementController);
    app.use("/api/admin", Logs_controller_1.LogsController);
    app.use("/api/admin", admin_email_controller_1.AdminEmailController);
    app.use("/api/admin", download_report_controller_1.AdminDownloadController);
    app.use("/api/notification", notifications_controller_1.NotificationController);
    app.use("/api/website", website_controller_1.WebsiteController);
    app.use("/api/gallery", gallery_controller_1.GalleryController);
    app.use("/api/partner", partners_controller_1.PartnerController);
    app.use("/api/blog", blog_controller_1.BlogController);
    app.use("/api/leaderboard", leaderboard_controller_1.LeaderboardController);
    app.get("/health", (req, res) => res.json({ status: "ok" }));
    return app;
};
exports.createApp = createApp;
