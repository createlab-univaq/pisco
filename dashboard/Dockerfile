FROM instrumentisto/flutter:3.38 AS build

WORKDIR /app

# Copy pubspec files and resolve dependencies
COPY pubspec.* ./
RUN flutter pub get

# Copy the rest of the application
COPY . .

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