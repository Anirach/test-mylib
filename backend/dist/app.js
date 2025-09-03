"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const books_1 = __importDefault(require("./routes/books"));
const lending_1 = __importDefault(require("./routes/lending"));
const upload_1 = __importDefault(require("./routes/upload"));
const errorHandler_1 = require("./middleware/errorHandler");
const swagger_1 = require("./swagger/swagger");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});
app.get('/api', (req, res) => {
    res.json({
        message: 'Book Management API',
        version: '1.0.0',
        endpoints: {
            books: '/api/books',
            lending: '/api/lending',
            upload: '/api/upload'
        }
    });
});
(0, swagger_1.setupSwagger)(app);
app.use('/api/books', books_1.default);
app.use('/api/lending', lending_1.default);
app.use('/api/upload', upload_1.default);
app.use((req, res, next) => {
    const message = `Route ${req.originalUrl} not found`;
    res.status(404).json({
        success: false,
        error: message
    });
});
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map