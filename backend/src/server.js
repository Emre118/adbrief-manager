const app = require('./app');
const { port } = require('./config');
const { initDb } = require('./db');

async function startServer() {
  try {
    await initDb();

    app.listen(port, () => {
      console.log(`AdBrief Manager is running on http://localhost:${port}`);
      console.log(`Swagger UI is available on http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
