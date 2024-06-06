import morgan from 'morgan';
import type { Request } from 'express';

export function getMorganLogger() {
  // Custom token to log request body and query parameters
  morgan.token('body', (req: Request) => JSON.stringify(req.body));
  morgan.token('query', (req: Request) => JSON.stringify(req.query));

  // Custom format string to include URL, body, and query
  const customFormat = ':method :url :status :res[content-length] - :response-time ms - body: :body - query: :query';
  // Use morgan with the custom format
  return morgan(customFormat);
}