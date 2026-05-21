const swaggerUi = require('swagger-ui-express');

const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'AdBrief Manager API',
    version: '1.0.0',
    description: 'REST API for managing user-specific advertising campaign briefs with JWT authentication.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Emre' },
          email: { type: 'string', example: 'emre@example.com' },
          password: { type: 'string', example: 'password123' }
        }
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'emre@example.com' },
          password: { type: 'string', example: 'password123' }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Emre' },
          email: { type: 'string', example: 'emre@example.com' },
          createdAt: { type: 'string', example: '2026-05-20 12:00:00' }
        }
      },
      SafeUserProfile: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Emre' },
          email: { type: 'string', example: 'emre@example.com' }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/User' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
        }
      },
      CampaignBriefInput: {
        type: 'object',
        required: ['title', 'brandName', 'platform', 'objective', 'budget', 'deadline', 'priority', 'status'],
        properties: {
          title: { type: 'string', example: 'Spring Sale Meta Campaign' },
          brandName: { type: 'string', example: 'Nova Shoes' },
          platform: { type: 'string', enum: ['Meta', 'Google', 'TikTok', 'LinkedIn', 'Other'], example: 'Meta' },
          objective: { type: 'string', enum: ['Awareness', 'Traffic', 'Leads', 'Sales'], example: 'Sales' },
          budget: { type: 'number', example: 5000 },
          startDate: { type: 'string', format: 'date', example: '2026-05-20' },
          deadline: { type: 'string', format: 'date', example: '2026-05-25' },
          targetAudience: { type: 'string', example: '18-34 online shoppers' },
          priority: { type: 'string', enum: ['Low', 'Medium', 'High'], example: 'High' },
          status: { type: 'string', enum: ['Draft', 'In Progress', 'Ready', 'Published', 'Archived'], example: 'In Progress' },
          notes: { type: 'string', example: 'Prepare creative variations and landing page copy.' }
        }
      },
      CampaignBrief: {
        allOf: [
          { $ref: '#/components/schemas/CampaignBriefInput' },
          {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              userId: { type: 'integer', example: 1 },
              createdAt: { type: 'string', example: '2026-05-20 12:00:00' },
              updatedAt: { type: 'string', example: '2026-05-20 12:30:00' }
            }
          }
        ]
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Validation failed.' },
          details: { type: 'object' }
        }
      }
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' }
              }
            }
          },
          400: { description: 'Validation error' },
          409: { description: 'Email already registered' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in and receive JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' }
              }
            }
          },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current authenticated user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Current authenticated user profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/SafeUserProfile' }
                  }
                }
              }
            }
          },
          401: { description: 'Unauthorized' },
          404: { description: 'User not found' }
        }
      }
    },
    '/api/briefs': {
      get: {
        tags: ['Campaign Briefs'],
        summary: 'List authenticated user campaign briefs',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'search', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'status', in: 'query', required: false, schema: { type: 'string', enum: ['Draft', 'In Progress', 'Ready', 'Published', 'Archived'] } },
          { name: 'platform', in: 'query', required: false, schema: { type: 'string', enum: ['Meta', 'Google', 'TikTok', 'LinkedIn', 'Other'] } },
          { name: 'priority', in: 'query', required: false, schema: { type: 'string', enum: ['Low', 'Medium', 'High'] } }
        ],
        responses: {
          200: {
            description: 'Campaign brief list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    briefs: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/CampaignBrief' }
                    }
                  }
                }
              }
            }
          },
          401: { description: 'Unauthorized' }
        }
      },
      post: {
        tags: ['Campaign Briefs'],
        summary: 'Create a campaign brief for the authenticated user',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CampaignBriefInput' }
            }
          }
        },
        responses: {
          201: { description: 'Campaign brief created' },
          400: { description: 'Validation error' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/briefs/summary': {
      get: {
        tags: ['Campaign Briefs'],
        summary: 'Get authenticated user dashboard summary',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Summary data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    summary: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer', example: 3 },
                        byStatus: { type: 'object' },
                        totalBudget: { type: 'number', example: 12500 },
                        highPriorityCount: { type: 'integer', example: 2 },
                        nearestDeadline: {
                          type: 'string',
                          nullable: true,
                          example: '2026-05-25'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/briefs/{id}': {
      get: {
        tags: ['Campaign Briefs'],
        summary: 'Get one campaign brief owned by the authenticated user',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Campaign brief detail' },
          404: { description: 'Campaign brief not found' },
          401: { description: 'Unauthorized' }
        }
      },
      put: {
        tags: ['Campaign Briefs'],
        summary: 'Update one campaign brief owned by the authenticated user',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CampaignBriefInput' }
            }
          }
        },
        responses: {
          200: { description: 'Campaign brief updated' },
          400: { description: 'Validation error' },
          404: { description: 'Campaign brief not found' },
          401: { description: 'Unauthorized' }
        }
      },
      delete: {
        tags: ['Campaign Briefs'],
        summary: 'Delete one campaign brief owned by the authenticated user',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Campaign brief deleted' },
          404: { description: 'Campaign brief not found' },
          401: { description: 'Unauthorized' }
        }
      }
    }
  }
};

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
}

module.exports = {
  setupSwagger,
  openApiSpec
};
