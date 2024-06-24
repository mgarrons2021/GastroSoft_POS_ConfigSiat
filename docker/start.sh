#!/bin/bash
cd /app
npm install --legacy-peer-deps
npm run build
cp -Rf ./dist/* ./public
http-server --cors -p8080 /app/public