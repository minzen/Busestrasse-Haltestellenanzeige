# Haltestellenanzeige Busestraße, Bremen

Diese Anwendung holt die Abfahrtszeiten an der Haltestelle Busestraße in Bremen. Die Ansicht wird in der Realzeit aktualisiert. 

Das Backend läuft auf NodeJS und das Frontend ist auf ReactJS und TailwindCSS gebaut. 


## Build the version to be deployed 

* Update the version number in docker-compose.yml

```
docker compose build
docker save -o busestra-backend_x.x.tar busestra-backend:x.x

docker save -o busestra-frontend_x.x.tar busestra-frontend:x.x

```

* Copy the tar files to the target system
```
docker load -i busestra-backend_x.x.tar
docker load -i busestra-frontend_x.x.tar

docker compose up -d
```