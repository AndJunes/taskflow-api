# syntax=docker/dockerfile:1

# ── Base ────────────────────────────────────────────────────────────
FROM node:22-alpine AS base
# pnpm 9 fijo (el lockfile es lockfileVersion '9.0'); build reproducible
RUN npm install -g pnpm@9
WORKDIR /app

# ── Dependencias (capa cacheada) ────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ── Desarrollo (Vite dev server + HMR) ──────────────────────────────
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5173
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# ── Build de estáticos ──────────────────────────────────────────────
# VITE_API_URL se incrusta en build time (Vite lo "hornea" en el bundle),
# por eso llega como build arg, no como variable de runtime.
FROM deps AS build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
COPY . .
RUN pnpm build

# ── Producción (estáticos servidos por nginx) ───────────────────────
FROM nginx:alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
