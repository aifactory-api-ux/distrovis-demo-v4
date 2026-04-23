#!/bin/bash
set -e

echo "Seeding database..."

psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /app/backend/database/seed/seed.sql

echo "Seeding completed successfully!"