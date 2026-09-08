# OrderFlow LLD

## Models
User: name, email, passwordHash, role.
Product: name, description, price, stock, category.
Cart: user, items(product, quantity).
Order: user, item snapshots, total, status, idempotencyKey, timestamps.

## Middleware
`auth` verifies the JWT and attaches `req.user`. `roles('admin')` protects administrative operations. Express JSON middleware parses request bodies. Security middleware is registered globally.

## Controller/module responsibilities
Routes define HTTP contracts. Models define persistence. Business logic such as checkout coordinates multiple models and transaction boundaries. Keep authorization at the API boundary and never trust role values sent by clients.

## Checkout pseudocode
```text
verify JWT
read Idempotency-Key
if matching order exists -> return it
start transaction
load cart
for every cart item:
    update product only when stock >= requested quantity
    if update fails -> abort
calculate total from database prices
create order using price snapshots
delete cart
commit
return order
```

## Performance
Index fields used by equality/filter/sort patterns. Use projections for narrow responses. Use `lean()` for read-only queries. Paginate list endpoints. Aggregate analytics in the database instead of downloading all orders into Node.

## Security boundaries
Public: product listing, registration/login. Authenticated: cart and own orders. Admin: product writes, inventory and all-order analytics.
