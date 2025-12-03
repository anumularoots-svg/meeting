FROM python:3.10-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Install minimal system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    default-libmysqlclient-dev \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

RUN pip install --upgrade pip setuptools wheel

COPY requirements.txt .

# Create lightweight requirements (skip heavy ML packages)
RUN grep -v -E "torch|tensorflow|mediapipe|whisper|transformers|opencv|dlib|face_recognition" requirements.txt > requirements-light.txt || cp requirements.txt requirements-light.txt

RUN pip install --no-cache-dir -r requirements-light.txt || pip install --no-cache-dir django gunicorn pymysql mysqlclient python-dotenv djangorestframework django-cors-headers

COPY . .

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "2", "--timeout", "120", "SampleDB.wsgi:application"]
