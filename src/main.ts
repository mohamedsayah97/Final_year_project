import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupMetrics } from './utils/metrics.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup Prometheus metrics
  setupMetrics(app);

  // Utiliser le port depuis les variables d'environnement avec fallback à port 3000
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  await app.listen(port);

  // Type-safe address extraction
  const server = app.getHttpServer();
  const address = server.address();
  let assignedPort: number;

  if (address && typeof address === 'object' && 'port' in address) {
    assignedPort = (address as { port: number }).port;
  } else if (typeof address === 'string') {
    const parts = address.split(':');
    assignedPort = parseInt(parts[parts.length - 1] || '3000');
  } else {
    assignedPort = port;
  }

  console.log(`Application running on: http://localhost:${assignedPort}`);
  console.log(`Metrics available on: http://localhost:${assignedPort}/metrics`);
}

// Handle floating promise
void bootstrap();
