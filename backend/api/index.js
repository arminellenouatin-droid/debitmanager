const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const { AppModule } = require('../dist/app.module');
const express = require('express');

let cachedServer;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    
    // Enable CORS
    app.enableCors({
      origin: true,
      credentials: true,
    });
    
    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

module.exports = async (req, res) => {
  const app = await bootstrap();
  app(req, res);
};
