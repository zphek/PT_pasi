FROM node:18

WORKDIR app/server

COPY . .

# Instalar dependencias
RUN ["npm", "install"]

# Generar el cliente de Prisma
RUN npx prisma generate

# Exponer el puerto que usa NestJS
EXPOSE 4000

# Para desarrollo, necesitas habilitar el modo "watch"
CMD ["npm", "run", "start:dev", "--", "--watch"]