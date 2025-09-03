"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Book Management API',
            version: '1.0.0',
            description: 'A comprehensive API for managing book collections, lending, and file uploads',
            contact: {
                name: 'API Support',
                email: 'support@bookmanagement.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: process.env.BASE_URL || 'http://localhost:3001',
                description: 'Development server'
            }
        ],
        components: {
            schemas: {
                Book: {
                    type: 'object',
                    required: ['title', 'author'],
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique identifier for the book'
                        },
                        title: {
                            type: 'string',
                            maxLength: 255,
                            description: 'Title of the book'
                        },
                        author: {
                            type: 'string',
                            maxLength: 255,
                            description: 'Author of the book'
                        },
                        isbn: {
                            type: 'string',
                            pattern: '^(?:\\d{10}|\\d{13})$',
                            description: 'ISBN number (10 or 13 digits)'
                        },
                        genre: {
                            type: 'string',
                            maxLength: 100,
                            description: 'Genre of the book'
                        },
                        description: {
                            type: 'string',
                            maxLength: 2000,
                            description: 'Description of the book'
                        },
                        coverImageUrl: {
                            type: 'string',
                            format: 'url',
                            description: 'URL to the book cover image'
                        },
                        pdfFileUrl: {
                            type: 'string',
                            format: 'url',
                            description: 'URL to the PDF file'
                        },
                        status: {
                            type: 'string',
                            enum: ['OWNED', 'LENT', 'WISHLIST', 'LOST'],
                            description: 'Current status of the book'
                        },
                        categoryId: {
                            type: 'string',
                            format: 'uuid',
                            nullable: true,
                            description: 'Category ID the book belongs to'
                        },
                        dateAdded: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Date when the book was added'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp'
                        }
                    }
                },
                LendingInfo: {
                    type: 'object',
                    required: ['bookId', 'borrowerName', 'borrowerContact', 'expectedReturn'],
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique identifier for the lending record'
                        },
                        bookId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID of the lent book'
                        },
                        borrowerName: {
                            type: 'string',
                            maxLength: 255,
                            description: 'Name of the borrower'
                        },
                        borrowerContact: {
                            type: 'string',
                            maxLength: 255,
                            description: 'Contact information of the borrower'
                        },
                        dateLent: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Date when the book was lent'
                        },
                        expectedReturn: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Expected return date'
                        },
                        actualReturn: {
                            type: 'string',
                            format: 'date-time',
                            nullable: true,
                            description: 'Actual return date (null if not returned)'
                        },
                        notes: {
                            type: 'string',
                            maxLength: 1000,
                            description: 'Additional notes about the lending'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp'
                        }
                    }
                },
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            description: 'Indicates if the request was successful'
                        },
                        data: {
                            type: 'object',
                            description: 'Response data (varies by endpoint)'
                        },
                        message: {
                            type: 'string',
                            description: 'Human-readable message'
                        },
                        error: {
                            type: 'string',
                            description: 'Error message (present when success is false)'
                        },
                        pagination: {
                            type: 'object',
                            properties: {
                                page: { type: 'number' },
                                limit: { type: 'number' },
                                total: { type: 'number' },
                                totalPages: { type: 'number' }
                            }
                        }
                    }
                },
                ValidationError: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        error: {
                            type: 'string',
                            example: 'Validation failed'
                        },
                        message: {
                            type: 'string',
                            example: 'Validation errors: Title is required, Author is required'
                        }
                    }
                },
                FileInfo: {
                    type: 'object',
                    properties: {
                        originalName: {
                            type: 'string',
                            description: 'Original filename'
                        },
                        filename: {
                            type: 'string',
                            description: 'Stored filename'
                        },
                        size: {
                            type: 'number',
                            description: 'File size in bytes'
                        },
                        mimetype: {
                            type: 'string',
                            description: 'MIME type of the file'
                        },
                        url: {
                            type: 'string',
                            format: 'url',
                            description: 'Public URL to access the file'
                        }
                    }
                }
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: [
        './src/routes/*.ts',
        './src/controllers/*.ts'
    ]
};
const specs = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Book Management API Documentation',
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true
        }
    }));
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
};
exports.setupSwagger = setupSwagger;
exports.default = specs;
//# sourceMappingURL=swagger.js.map