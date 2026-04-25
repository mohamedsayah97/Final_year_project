import * as client from 'prom-client';
import { INestApplication } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

// Collect default Node.js metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics();

// REST API response time histogram
export const restResponseTimeHistogram = new client.Histogram({
  name: 'rest_response_time_duration_seconds',
  help: 'REST API response time in seconds',
  labelNames: ['method', 'route', 'status'] as const,
  buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
});

// Database response time histogram
export const databaseResponseTimeHistogram = new client.Histogram({
  name: 'db_response_time_duration_seconds',
  help: 'Database response time in seconds',
  labelNames: ['operation', 'success'] as const,
});

// Setup metrics endpoint and middleware
export const setupMetrics = (app: INestApplication): void => {
  // Get the underlying Express instance with type assertion
  const httpAdapter = app.getHttpAdapter();
  const expressApp = httpAdapter.getInstance() as {
    get: (
      path: string,
      handler: (req: Request, res: Response) => Promise<void>,
    ) => void;
    use: (
      middleware: (req: Request, res: Response, next: NextFunction) => void,
    ) => void;
  };

  // Metrics endpoint
  expressApp.get('/metrics', async (_req: Request, res: Response) => {
    res.setHeader('Content-Type', client.register.contentType);
    res.send(await client.register.metrics());
  });

  // Response time middleware
  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/metrics') {
      return next();
    }

    const endTimer = restResponseTimeHistogram.startTimer();

    res.on('finish', () => {
      endTimer({
        method: req.method,
        route:
          req.route && typeof req.route === 'object' && 'path' in req.route
            ? (req.route.path as string)
            : req.path,
        status: res.statusCode,
      });
    });

    next();
  });

  console.log('✅ Prometheus metrics initialized on /metrics');
};
