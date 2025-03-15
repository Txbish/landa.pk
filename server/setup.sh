#!/bin/bash

# Create root directories
mkdir -p src/{config,controllers,middleware,models,routes,services,utils}
mkdir -p tests

# Create environment files
touch .env .env.development .env.production .eslintrc.js jest.config.js index.js

# Create configuration files
touch src/config/{db.js,env.js,passport.js}

# Create controllers
touch src/controllers/{auth.controller.js,user.controller.js,product.controller.js,order.controller.js}

# Create middleware
touch src/middleware/{auth.middleware.js,validation.middleware.js,error.middleware.js}

# Create models
touch src/models/{user.model.js,product.model.js,order.model.js,category.model.js}

# Create routes
touch src/routes/{auth.routes.js,user.routes.js,product.routes.js,order.routes.js}

# Create services
touch src/services/{email.service.js,file.service.js,payment.service.js}

# Create utility files
touch src/utils/{logger.js,helpers.js}

# Create main application file
touch src/app.js

# Success message
echo "🚀 Project structure created successfully!"
