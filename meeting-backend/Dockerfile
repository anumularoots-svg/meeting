FROM python:3.10-slim-bookworm
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive
WORKDIR /app
# Install minimal system dependencies including build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    pkg-config \
    libpq-dev \
    default-libmysqlclient-dev \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean
RUN pip install --upgrade pip setuptools wheel
# Install core dependencies only (no ML packages)
RUN pip install --no-cache-dir \
    django==4.2.* \
    gunicorn \
    pymysql \
    mysqlclient \
    python-dotenv \
    djangorestframework \
    django-cors-headers \
    channels \
    redis \
    celery \
    boto3 \
    pillow \
    requests \
    pytz \
    python-dateutil
COPY . .
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "2", "--timeout", "120", "SampleDB.wsgi:application"]
