# OrderFlow Interview Questions

1. Why Node.js? Runtime for JavaScript server code; async I/O suits API workloads.
2. What is Express middleware? A function in the request pipeline that can inspect/change the request/response or end/pass control.
3. Authentication vs authorization? Identity vs permission.
4. Why hash passwords? Plain passwords are dangerous if the database leaks.
5. Is JWT encrypted? No. It is signed; payload is readable.
6. Why indexes? Faster reads for matching query patterns at the cost of storage/write overhead.
7. Why transactions in checkout? Inventory and order state must remain consistent.
8. How prevent overselling? Conditional atomic stock decrement inside a transaction.
9. Why idempotency? Retries must not create duplicate orders.
10. Why snapshot price in Order? Historical orders should not change when current product price changes.
11. Why pagination? Bound memory, network payload and database work.
12. Why lean? Faster/lighter read-only Mongoose results.
13. Why aggregation? Compute analytics near the data instead of transferring every record to the API.
14. Why Docker? Consistent environment and isolated services.
15. Image vs container? Image is a packaged template; container is a running instance.
16. Why modular monolith? Simple deployment while retaining clear domain boundaries.
17. How scale API? Stateless instances behind a load balancer.
18. What would Redis do? Cache safe-to-cache reads and support distributed coordination where appropriate.
19. What would a queue do? Move slow non-critical work such as notifications off the request path.
20. What would you monitor? latency, error rate, throughput, DB latency, CPU/memory, queue depth and business failures.
