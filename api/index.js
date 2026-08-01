console.log('[MODULE LOADER] Loading index.js...');

const { NestFactory } = require('@nestjs/core');
console.log('[MODULE LOADER] @nestjs/core loaded');

const { ExpressAdapter } = require('@nestjs/platform-express');
console.log('[MODULE LOADER] @nestjs/platform-express loaded');

const express = require('express');
console.log('[MODULE LOADER] express loaded');

let cachedServer;

async function bootstrap() {
  try {
    console.log('[BOOTSTRAP] Starting bootstrap...');
    
    if (!cachedServer) {
      console.log('[BOOTSTRAP] Creating express app...');
      const expressApp = express();
      
      console.log('[BOOTSTRAP] Loading AppModule...');
      const { AppModule } = require('./app.module');
      console.log('[BOOTSTRAP] AppModule loaded successfully');
      
      console.log('[BOOTSTRAP] Creating NestJS app...');
      const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
      console.log('[BOOTSTRAP] NestJS app created');
      
      // Enable CORS
      console.log('[BOOTSTRAP] Enabling CORS...');
      app.enableCors({
        origin: true,
        credentials: true,
      });
      
      console.log('[BOOTSTRAP] Initializing app...');
      await app.init();
      console.log('[BOOTSTRAP] App initialized');
      
      cachedServer = expressApp;
      console.log('[BOOTSTRAP] Server cached');
    }
    
    console.log('[BOOTSTRAP] Returning cached server');
    return cachedServer;
  } catch (error) {
    console.error('[BOOTSTRAP ERROR]', error);
    console.error('[BOOTSTRAP ERROR STACK]', error.stack);
    throw error;
  }
}

module.exports = async (req, res) => {
  try {
    console.log('[HANDLER] Request received:', req.method, req.url);
    const app = await bootstrap();
    console.log('[HANDLER] Bootstrap completed, handling request');
    app(req, res);
  } catch (error) {
    console.error('[HANDLER ERROR]', error);
    console.error('[HANDLER ERROR STACK]', error.stack);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message,
      stack: error.stack 
    });
  }
};
