// [WPA-CLEANUP Phase 3] THIS FILE IS NOT MOUNTED IN app.ts.
// It was never required by src/app.ts (which uses src/api/v1/routes.ts instead).
// ownerRouter is an enterprise-only module for clinic/pharmacy owner management.
// This file will be removed in Phase 4 along with the owner/ module folder.

const express = require('express');

const { ownerRouter } = require('./modules/owner/routes/owner.routes');

const apiV1Router = express.Router();

apiV1Router.get('/', (req, res) => {
  res.json({ name: 'BPA API', version: 'v1' });
});

apiV1Router.use('/owner', ownerRouter);

module.exports = { apiV1Router };

export {};
