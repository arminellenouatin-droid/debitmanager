#!/bin/bash
npm install --include=dev
npm run build
mkdir -p dist/api
cp api/index.js dist/api/index.js
