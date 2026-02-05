# Sora Chat - Project Structure

## Root

- `be_bun/`: Backend service.
- `sora-chat-fe/`: Frontend application.
- `gateway/`: (Potential) Gateway or Proxy.
- `docs/`: Documentation.

## Backend (`be_bun/src`)

- `index.js`: Server entry, Bun instance, Socket.io binding.
- `app.js`: Hono app setup, API route registration.
- `socket.js`: Socket.io event handlers and middleware.
- `routers/`: API routing (Auth, Users, Conversations).
- `services/`: Business logic (AuthService, MessageService, etc.).
- `data/`:
  - `entities/`: Mongoose schemas and models.
  - `mongo.connect.js`: Database connection logic.
- `middlewares/`: Custom Hono middlewares.
- `validations/`: Zod schemas for request validation.
- `utils/`: Common utility functions.

## Frontend (`sora-chat-fe/src`)

- `main.js`: App initialization.
- `App.vue`: Root component.
- `apis/`: Axios wrappers for API communication (Auth, Users, Conversations, Images).
- `stores/`: Pinia stores (Auth, Socket, Conversation).
- `views/`: Page components (Login, Home/Chat).
- `components/`: Reusable UI components.
- `layouts/`: Page layout wrappers.
- `router/`: Vue Router configuration.
