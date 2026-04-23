#!/bin/bash
set -e

echo "Running database migrations..."

psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /app/backend/database/migrations/001_init.sql

echo "Migrations completed successfully!"