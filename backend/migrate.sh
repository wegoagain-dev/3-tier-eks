#!/bin/bash
# Exit on error
set -e

echo "Starting database setup..."
python run_migrations.py
