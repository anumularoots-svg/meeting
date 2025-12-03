FROM python:3.10-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive

WORKDIR /app

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

RUN pip install --no-cache-dir \
    django==4.2.* \
    gunicorn \
    pymysql \
    mysqlclient \
    python-dotenv \
    djangorestframework \
    django-cors-headers \
    django-extensions \
    channels \
    channels-redis \
    redis \
    celery \
    boto3 \
    pillow \
    requests \
    pytz \
    python-dateutil \
    pymongo \
    pydub \
    fpdf \
    openai \
    livekit \
    livekit-api \
    deep-translator \
    googletrans==4.0.0-rc1 \
    asgiref \
    daphne \
    whitenoise \
    cryptography \
    pyjwt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "2", "--timeout", "120", "SampleDB.wsgi:application"]
