# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies including PostgreSQL client, build tools, and dos2unix
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    gcc \
    python3-dev \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Create a non-root user
RUN adduser --disabled-password --gecos '' appuser

# Copy application code and set ownership to appuser
COPY --chown=appuser:appuser . .

# Ensure migrate.sh is executable
RUN chmod +x migrate.sh

# Explicitly ownership of /app to allow writing migrations
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "run:app"]
