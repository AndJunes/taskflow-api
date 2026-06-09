#!/bin/sh
set -e

# Aplica las migraciones de la base de datos antes de arrancar la app.
# El esquema solo se crea vía Alembic (no hay create_all), por eso esto
# es obligatorio en cada arranque.
alembic upgrade head

# Ejecuta el comando recibido (uvicorn ...)
exec "$@"
