# PT_Pasi

Prueba técnica(startup PASI).

## Requisitos Previos

Asegúrate de tener instalados los siguientes componentes en tu sistema:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Instalación

1. Agrega el archivo `.env` proporcionado por mi(Bernardo :)) en la raiz del proyecto, el archivo debe lucir algo asi:

   ```env
   # Frontend
   CLIENT_BASE_URL=http://server:4000

   # Backend
   DATABASE_URL=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/PT_Pasi?retryWrites=true&w=majority
   SUPABASE_URL=https://<tu-supabase-url>
   SUPABASE_KEY=<tu-supabase-key>
   SUPABASE_JWT_SECRET=<tu-jwt-secret>
   SERVER_PORT=4000
   ```

2. Construye y levanta los contenedores con Docker Compose:

   ```bash
   docker-compose up -d
   ```

3. Accede a la aplicación:

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:4000](http://localhost:4000)