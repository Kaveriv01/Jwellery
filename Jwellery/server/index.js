require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

/**
 * Start the server after establishing a database connection.
 * Any unhandled rejection from DB connection will terminate the process.
 */
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`\n💎 Jwellery Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`🔗 API Health: http://localhost:${PORT}/api/health\n`);
  });

  // ── Graceful Shutdown ──────────────────────────────────────────────────────
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });

  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });
};

startServer();
