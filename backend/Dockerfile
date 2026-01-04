# --- Build Stage ---
# Use a specific version of the Python slim image as the base for our builder.
# 'AS builder' names this stage so we can refer to it later.
FROM python:3.11-slim AS builder

# Set the working directory for this build stage.
WORKDIR /app

# Install system-level dependencies required for building Python packages.
# - build-essential: For compiling C extensions (includes gcc, make, etc.)
# - libpq-dev: Development headers for building the psycopg2 PostgreSQL adapter.
# We clean up the apt cache in the same layer to keep this stage lean.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the build stage.
# This is done first to leverage Docker's layer caching.
COPY requirements.txt .

# Install Python dependencies into a specific directory (/install).
# This makes it easy to copy just the installed packages to the final stage.
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# --- Production Stage ---
# Use the same lean Python image for the final production image.
FROM python:3.11-slim

# Install runtime dependencies
# - libpq5: PostgreSQL client library (required by psycopg2 at runtime)
# - bash: For running migration shell scripts
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libpq5 \
    bash \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create a non-root user to run the application for better security.
RUN adduser --disabled-password --gecos '' appuser

# Set the working directory for the final application.
WORKDIR /app

# Copy only the installed Python packages from the 'builder' stage.
# This is the key step that makes the final image small and secure.
COPY --from=builder /install /usr/local

# Copy the application source code into the final image.
# Set ownership to the non-root user in one step.
COPY --chown=appuser:appuser . .

# Ensure the /app directory is owned by appuser
# This is needed for creating migrations directory
RUN chown -R appuser:appuser /app

# Ensure that the migration scripts are executable.
# Do this before switching to appuser so we have permissions.
RUN chmod +x migrate.sh run_migrations.py

# Switch to the non-root user.
USER appuser

# Expose the port that the application will run on.
EXPOSE 8000

# Define the command to run the application using Gunicorn.
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "run:app"]