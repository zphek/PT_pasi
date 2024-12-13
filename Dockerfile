FROM mongo:latest
COPY mongo-keyfile /data/mongo-keyfile
RUN chown mongodb:mongodb /data/mongo-keyfile && chmod 400 /data/mongo-keyfile