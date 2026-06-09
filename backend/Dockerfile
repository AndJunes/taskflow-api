# syntax=docker/dockerfile:1

# ── Base ────────────────────────────────────────────────────────────
# Imagen oficial de uv con Python 3.13 (Debian bookworm slim)
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim AS base
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PATH="/app/.venv/bin:$PATH"
WORKDIR /app

# ── Dependencias (capa cacheada) ────────────────────────────────────
# Instala solo las deps de runtime (sin el proyecto, no es un paquete
# instalable). uv crea el entorno en /app/.venv.
FROM base AS deps
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project --no-dev

# ── Producción ──────────────────────────────────────────────────────
FROM base AS prod
COPY --from=deps /app/.venv /app/.venv
COPY . .
RUN useradd --create-home --shell /bin/sh appuser \
    && mkdir -p /data \
    && chown -R appuser:appuser /app /data
USER appuser
EXPOSE 8000
# Corre las migraciones de Alembic y luego el comando (CMD)
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# ── Desarrollo (incluye dev deps + hot reload) ──────────────────────
FROM base AS dev
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project
COPY . .
EXPOSE 8000
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
