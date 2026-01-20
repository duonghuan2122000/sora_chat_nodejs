# Sora Chat - Technology Stack

## Backend (`be_bun`)

- **Runtime**: [Bun](https://bun.sh/)
- **Web Framework**: [Hono](https://hono.dev/)
- **Real-time**: [Socket.io](https://socket.io/) (with `@socket.io/bun-engine`)
- **Database**: [MongoDB](https://www.mongodb.com/) (using [Mongoose](https://mongoosejs.com/))
- **Validation**: [Zod](https://zod.dev/)
- **Time/Date**: [Luxon](https://moment.github.io/luxon/)
- **Authentication**: JWT (JSON Web Token)

## Frontend (`sora-chat-fe`)

- **Framework**: [Vue 3](https://vuejs.org/) (SFC, Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4), [Element Plus](https://element-plus.org/)
- **Icons**: [Lucide Vue Next](https://lucide.dev/guide/packages/lucide-vue-next)
- **Real-time Client**: [Socket.io Client](https://socket.io/docs/v4/client-api/)
- **Forms/Validation**: [VeeValidate](https://vee-validate.logaretm.com/v4/), [Zod](https://zod.dev/)
- **Utilities**: [VueUse](https://vueuse.org/)

## Infrastructure

- **Containerization**: Docker, Docker Compose
- **Package Manager**: Bun
