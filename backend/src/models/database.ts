// Database connection configuration
// Note: This will be properly configured once Prisma is set up

interface DatabaseClient {
  $disconnect(): Promise<void>;
}

// Temporary mock until Prisma is properly set up
const mockPrismaClient: DatabaseClient = {
  $disconnect: async () => {
    console.log('Database disconnected');
  },
};

// Create a singleton instance of database client
const database = mockPrismaClient;

// Graceful shutdown
process.on('beforeExit', async () => {
  await database.$disconnect();
});

// Handle application shutdown
process.on('SIGINT', async () => {
  await database.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await database.$disconnect();
  process.exit(0);
});

export default database; 