# OrderFlow Learning Guide

## 0. Goal
Do not memorize this project. Learn why each component exists. You should be able to explain the request from browser to database and back.

## 1. What problem are we solving?
An online store needs one reliable workflow for customers, products, stock, carts and orders. Without a backend, the browser cannot safely decide prices or inventory. Without a database, data disappears. Without transactions, two users can buy the last item simultaneously and corrupt stock.

## 2. MERN in one sentence
MongoDB stores data; Express exposes HTTP APIs; Node.js runs the server; React renders the browser UI.

## 3. The request journey
Browser -> HTTP request -> Express -> middleware -> route -> database/service logic -> MongoDB -> response -> React state/UI.

## 4. Node.js
Node is a JavaScript runtime outside the browser. It lets JavaScript run a server. It is event-driven and uses asynchronous I/O, which is useful for APIs that spend time waiting for databases/network operations.

## 5. Express
Express is a web framework on Node. It gives us routing and middleware. `app.use()` registers middleware; `app.get()`/`post()` register endpoints.

## 6. HTTP and REST
HTTP is the communication protocol. GET reads, POST creates/actions, PUT/PATCH updates, DELETE removes. A REST API models resources as URLs and uses HTTP methods/status codes. 200 means success, 201 creation, 400 bad request, 401 unauthenticated, 403 unauthorized, 404 missing, 409 conflict, 500 server failure.

## 7. Middleware
Middleware is a function that runs between receiving a request and the final handler. Think of airport security: the passenger passes through checks before reaching the gate. Auth middleware checks the JWT; Helmet adds security headers; rate limiting controls request volume; JSON middleware parses request bodies. `next()` passes control to the next middleware/handler. Middleware prevents duplicated checks across every route.

## 8. Authentication vs authorization
Authentication = who are you? Authorization = what are you allowed to do? A customer can buy products; an admin can manage inventory. JWT carries signed claims. The server verifies the signature instead of trusting browser data. Passwords are hashed with bcrypt and never stored as plain text.

## 9. JWT flow
1. User logs in.
2. Server finds the user.
3. bcrypt compares password with stored hash.
4. Server signs a JWT containing user id and role.
5. Browser sends `Authorization: Bearer <token>`.
6. auth middleware verifies it.
7. Route can use `req.user`.

JWT is signed, not encrypted; do not put secrets in its payload.

## 10. MongoDB
MongoDB is a document database. A document resembles JSON. A collection is roughly analogous to a table. It is useful here because product/order documents have naturally nested data and the application does not require complex relational joins for every operation.

## 11. Mongoose
Mongoose is the Node ODM used to define schemas, validation rules, models and queries. `Product.find()` queries MongoDB; `populate()` resolves referenced documents.

## 12. Data model
User -> Cart -> Product references. Order stores a snapshot of product name/price/quantity so historical orders remain correct even if a product's current price later changes. Order also references its user.

## 13. Indexes
An index is a data structure that helps the database find records without scanning everything. We index email, product name/category, order user/status and idempotency key. Indexes speed reads but consume memory/storage and add write cost, so index fields based on real query patterns.

## 14. Pagination
Never return 100,000 products at once. `page` and `limit` bound the result. The API caps the limit to protect the database and network.

## 15. Projection and lean
Projection selects only fields the client needs. Mongoose `lean()` returns plain objects instead of heavier Mongoose documents. This reduces overhead for read-only API responses.

## 16. Cart
The cart belongs to a user. Adding an item checks current stock. The cart is temporary; the order is the permanent purchase record.

## 17. Checkout and the critical race condition
Suppose stock is 1 and two customers checkout at the same time. A naive read-then-write can let both see stock=1. OrderFlow uses a conditional atomic update (`stock >= quantity`) inside a MongoDB transaction. If inventory cannot be reserved, checkout fails. The transaction ensures inventory reduction, order creation and cart deletion succeed together or roll back.

## 18. Transactions
A transaction groups multiple database operations into one all-or-nothing unit. We use it because checkout changes several pieces of business state that must remain consistent.

## 19. Idempotency
Networks retry requests. A checkout request could reach the server twice. The `Idempotency-Key` identifies the logical operation. If the same user sends the same key again, the existing order is returned instead of creating another order. This protects against duplicate orders.

## 20. Validation
Never trust browser input. Validate required fields, types, ranges and allowed enum values at the API boundary. Validation is different from authorization: validation asks whether data is well-formed; authorization asks whether the caller may perform the operation.

## 21. Security
Helmet sets useful HTTP security headers. CORS controls which browser origins can call the API. Rate limiting reduces abusive request volume. Body-size limits reduce oversized payload attacks. bcrypt protects stored passwords. JWT protects authenticated endpoints. In production, use HTTPS, strong secrets, secure cookie/token strategy and secret management.

## 22. React
React is the UI layer. Components represent pieces of the screen. State represents changing data. Effects are used for synchronization such as loading data. React Router changes views without full-page reloads. Axios centralizes HTTP calls.

## 23. Docker
Docker packages software and its runtime dependencies into containers. An image is the packaged template; a container is a running instance. Docker Compose defines multiple services together. Here MongoDB, API and frontend run as separate services and communicate over the Compose network.

## 24. Environment variables
Secrets and environment-specific settings should not be hardcoded. `MONGODB_URI`, `JWT_SECRET` and frontend API URL are configuration. `.env.example` documents required variables without exposing real secrets.

## 25. HLD
High-level design asks: what major components exist and how do they communicate?

```text
Customer/Admin Browser
        |
      HTTPS
        |
   React Frontend
        |
      Axios
        |
 API Gateway/Express
        |
 +------+------+------+
 | Auth | Catalog | Orders |
 +------+------+------+
        |
     Mongoose
        |
     MongoDB
```

For scale, add Redis cache, a queue/worker for email/notifications, object storage for images, centralized logs, metrics and a load balancer.

## 26. LLD
Low-level design asks about classes/modules, schemas, endpoint contracts, validation and exact flows. Main modules: auth, products, cart, orders, admin. Models: User, Product, Cart, Order. Middleware: auth and roles. Important service operation: checkout transaction.

## 27. API contracts
POST `/api/v1/auth/register` creates a user. POST `/login` authenticates. GET `/products` lists products. POST `/products` is admin-only. GET `/cart` reads the current cart. POST `/cart/items` adds an item. POST `/orders/checkout` performs an idempotent transactional checkout. GET `/orders` returns the user's orders. Admin endpoints manage order status and analytics.

## 28. Why not microservices?
This project is a modular monolith: one deployable backend with separated modules. For a portfolio and moderate scale this reduces operational complexity. At very large scale, orders, catalog, inventory and notifications could become services. Split only when independent scaling/deployment/team boundaries justify it.

## 29. Caching
Redis can cache frequently read catalog data. Cache invalidation is required when products change. Do not blindly cache stock or checkout decisions because stale inventory can cause incorrect business behavior.

## 30. Queues
Email, notifications and report generation do not need to block checkout. A queue lets the API record a job and a worker process it asynchronously. This improves latency and resilience.

## 31. Scalability path
Load balancer -> multiple stateless API instances -> MongoDB replica set; Redis for cache/rate limiting; queue for async jobs; CDN/object storage for images; monitoring and centralized logs.

## 32. Failure scenarios to understand
MongoDB unavailable: health check reports failure and API operations fail safely. Duplicate checkout: idempotency key prevents duplicate order. Concurrent stock purchase: conditional stock update plus transaction prevents overselling. Invalid JWT: 401. Valid JWT but customer accessing admin endpoint: 403. Slow database query: inspect indexes/query plan and reduce payload.

## 33. Interview explanation
“I built OrderFlow, a MERN e-commerce and order management platform. React provides the UI and Axios communicates with a Node/Express REST API. The backend uses JWT authentication, role-based authorization, bcrypt password hashing and validation middleware. MongoDB stores users, products, carts and orders through Mongoose. The most important backend design is checkout: inventory reservation and order creation run in a MongoDB transaction, with a conditional stock update to prevent overselling and an idempotency key to prevent duplicate orders after retries. I added indexes, pagination, projections and aggregation for performance, and Docker Compose for reproducible local environments.”

## 34. Study order
Read README -> server -> app -> middleware -> models -> auth -> products -> cart -> orders -> admin -> frontend -> Docker -> HLD -> LLD -> interview questions. After every file, answer: what does it do, why do we need it, what happens if removed, and what happens during one request?
