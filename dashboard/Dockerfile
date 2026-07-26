FROM instrumentisto/flutter:3.38 AS build

WORKDIR /app

# Copy pubspec files and resolve dependencies
COPY pubspec.* ./
RUN flutter pub get

# Copy the rest of the application
COPY . .

# pubspec.yaml declares `.env` as a bundled asset and flutter_dotenv reads it
# out of that bundle at runtime, so API_URL is frozen into the compiled output
# here. It must be supplied as a BUILD argument -- setting it in the runtime
# environment has no effect. `.env` itself is gitignored, so without this the
# build fails on a missing asset.
ARG API_URL
RUN if [ -n "$API_URL" ]; then printf 'API_URL=%s\n' "$API_URL" > .env; fi; \
    if [ ! -f .env ]; then \
      echo "ERROR: pass --build-arg API_URL=... or provide a .env file"; \
      exit 1; \
    fi

# Compile the Dart script to native executable
RUN flutter build web --release

# Use NGINX as web server, lightweight runtime image
FROM ghcr.io/nginx/nginx-unprivileged:1.29.5-alpine AS runtime

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy only the compiled web output from the build stage
COPY --from=build /app/build/web .

# nginx-unprivileged runs as UID 101; root-owned files are unreadable. Fix ownership.
USER root
RUN chown -R 101:101 /usr/share/nginx/html
USER 101

# nginx-unprivileged cannot bind privileged ports; its default config uses 8080
EXPOSE 8080