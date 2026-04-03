# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

E-Commerce Platform Backend API built with Express 5 and Mongoose 9, using ES modules (`"type": "module"`). Currently a **scaffold with TODO stubs** — models, controllers, routes, and auth/authorization middleware are placeholders awaiting implementation by assigned contributors.

## Commands

- **Start server:** `npm start` (requires MongoDB running at the URL in `.env`)
- **Dev with auto-reload:** `npm run dev` (uses nodemon)
- **No test framework configured yet.**

## Environment

Requires a `.env` file with: `PORT`, `DB_URL` (MongoDB connection string), `JWT_SECRET`.

## Architecture

Standard Express MVC pattern with this request flow:

```
Request → express.json() → logger → rateLimiter → routes → [auth → authorize] → controller → response
                                                                                      ↓
                                                                               errorHandler (catches thrown errors)
```

- **models/** — Mongoose schemas. `User` has password hashing + comparePassword method. `Product` refs `Category`. `Order` refs `User` and embeds items array with `Product` refs.
- **controllers/** — Business logic. Each resource has full CRUD. Products support search/filter/sort/pagination. Orders have ownership checks (users see only their own; admins see all).
- **routes/** — Express Router per resource, mounted at `/users`, `/products`, `/categories`, `/orders`. Public vs authenticated vs admin-only access per route.
- **middlewares/auth.js** — JWT Bearer token verification, attaches `req.user`.
- **middlewares/authorize.js** — Role-based access factory: `authorize("admin")`.
- **utils/generateToken.js** — Signs JWT with user ID and role, 7-day expiry.

## Key Patterns

- Errors are thrown (or passed via `next(err)`) and caught by the centralized `errorHandler` middleware which returns `{ success: false, message }`.
- Auth flow: `generateToken` on register/login → `auth` middleware verifies token and sets `req.user` → `authorize` checks `req.user.role`.
- Rate limiting: 100 requests per 15-minute window globally.
- All imports use `.js` extensions (required by ES modules with Node).
- REST API testing file at `test.rest` (for VS Code REST Client extension).
