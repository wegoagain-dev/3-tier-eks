# --- Build Stage ---
FROM python:3.11-slim AS builder

# Set the working directory for this build stage.
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the build stage.
# This is done first to leverage Docker's layer caching.
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# --- Production Stage ---
# Use the same lean Python image for the final production image.
FROM python:3.11-slim

# Set the working directory for the final application.
WORKDIR /app

# Install runtime dependencies and create non-root user
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    bash \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && useradd -m -u 1001 appuser \
    && chown appuser:appuser /app

# Copy installed packages from builder
COPY --from=builder --chown=appuser:appuser /root/.local /home/appuser/.local
ENV PATH=/home/appuser/.local/bin:$PATH

# Copy the application source code into the final image.
COPY --chown=appuser:appuser . .

# Ensure scripts are executable and appuser owns everything in /app
RUN chmod +x migrate.sh run_migrations.py \
    && chown -R appuser:appuser /app

# Switch to the non-root user.
USER appuser

ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Expose the port that the application will run on.
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:8000/health || exit 1

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "run:app"]
