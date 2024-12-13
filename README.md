# PT_Pasi

Prueba técnica para la integración de un sistema frontend y backend para la gestión de productos y reservas.

## Requisitos Previos

Asegúrate de tener instalados los siguientes componentes en tu sistema:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Instalación

1. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

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

   Asegúrate de reemplazar `<usuario>`, `<password>`, `<tu-supabase-url>`, `<tu-supabase-key>`, y `<tu-jwt-secret>` con tus valores reales.

2. Construye y levanta los contenedores con Docker Compose:

   ```bash
   docker-compose up -d
   ```

3. Accede a la aplicación:

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:4000](http://localhost:4000)

"# PT_pasi" 
