import { PrismaClient } from '@prisma/client';

// Global test setup
beforeAll(async () => {
  // Setup test environment
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/mediq_institution_test';
  process.env.RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://test:test@localhost:5672';
});

beforeEach(async () => {
  // Setup each test
});

afterEach(async () => {
  // Cleanup each test
});

afterAll(async () => {
  // Global cleanup
  const prisma = new PrismaClient();
  await prisma.$disconnect();
});

// Mock external dependencies
jest.mock('@nestjs/microservices', () => ({
  ...jest.requireActual('@nestjs/microservices'),
  ClientProxy: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
    emit: jest.fn(),
    close: jest.fn(),
  })),
}));

// Extend Jest matchers
expect.extend({
  toBeValidUUID(received) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid UUID`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid UUID`,
        pass: false,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidUUID(): R;
    }
  }
}
