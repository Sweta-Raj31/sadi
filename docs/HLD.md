# OrderFlow HLD

## Requirements
Customers browse products, maintain carts, checkout and view orders. Admins manage products/stock, update order status and view analytics.

## Components
- React SPA
- Express REST API
- Auth/RBAC middleware
- Catalog module
- Cart module
- Order module
- Admin/reporting module
- MongoDB
- Optional Redis and queue at scale

## Main flow
Client -> API -> auth/validation -> module -> MongoDB -> response.

## Checkout flow
Client sends idempotency key -> auth -> load cart -> transaction -> conditionally decrement stock -> create order snapshot -> delete cart -> commit -> response.

## Scale
API remains stateless so multiple instances can sit behind a load balancer. MongoDB scales with replica sets and appropriate indexes; sharding can be considered at much larger data volumes. Redis handles safe-to-cache reads; queues handle asynchronous work.

## Non-functional requirements
Security, consistency for checkout, availability, observability, bounded requests, predictable latency, maintainability and horizontal scalability.