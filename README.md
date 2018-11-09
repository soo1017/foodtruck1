# FoodTruck-Online-Order

Responive and Dynamic Web Application enabling Restaurant and FoodTruck online ordering

Features:
1. NodeJS, Express, Handlebar, MongoDB, and other packages used.
2. Online order enabling with both a guest and signin.
3. FoodTruck location display on the map based on its scheduled address.
4. Contact enabling.
5. Admin pages to see today's online orders and manage(modify, delete, add) online order items, modify foodtruck location, and manage DB. (~/admin/signin, ~/admin/signup)
6. Payment thru Stripe (disabled due to security)
7. Email-based password reset (disabled due to security)

To run the Code:
1. Install and eanble necessary tools (NodeJS, All Packages thru NPM, MongoDB) in your computer (http://localhost:3000)
2. Go to 'seed' directory and run 'node ftlocationseeder.js' and 'node productseeder.js' to set up foodtruck location addresses and online order items in DB
3. Run 'npm start' and go to 'http://localhost:3000' to see the main page
