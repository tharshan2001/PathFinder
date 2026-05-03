import swaggerJsdoc from "swagger-jsdoc";
import { paths } from "../swagger/routes/index.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PathFinder API",
      version: "1.0.0",
      description: "API documentation for PathFinder - Skill Training & Job Recommendation Platform",
      contact: {
        name: "PathFinder Team",
      },
    },
    servers: [
      {
        url: process.env.SERVER_URL || "http://localhost:5080",
        description: "Development server",
      },
    ],
    paths: paths,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            role: { type: "string", enum: ["user", "admin", "recruiter"] },
            headline: { type: "string", example: "Full Stack Developer" },
            bio: { type: "string", example: "Passionate about building web apps" },
          },
        },
        Course: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string", example: "React Fundamentals" },
            description: { type: "string" },
            category: { type: "string", example: "Web Development" },
            provider: { type: "string", example: "SLIIT" },
            level: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
            location: { type: "string", example: "Colombo, Sri Lanka" },
            duration: { type: "string", example: "8 weeks" },
            price: { type: "number", example: 0 },
            rating: { type: "number", example: 4.5 },
          },
        },
        Job: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string", example: "Software Engineer" },
            company: { type: "string", example: "Tech Corp" },
            location: { type: "string", example: "Colombo, Sri Lanka" },
            employmentType: { type: "string", enum: ["full-time", "part-time", "contract", "internship"] },
            salaryRange: { type: "object", properties: { min: { type: "number" }, max: { type: "number" } } },
            skillsRequired: { type: "array", items: { type: "string" } },
            description: { type: "string" },
            postedDate: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
            error: { type: "string" },
          },
        },
      },
    },
    security: [
      { bearerAuth: [] },
      { cookieAuth: [] },
    ],
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
