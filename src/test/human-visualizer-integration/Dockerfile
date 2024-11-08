# This dockerfile was quickly made to dockerize the application it has not been optimized.
FROM python:3.8-slim-bookworm AS builder
ENV PYTHONDONTWRITEBYTECODE=1
WORKDIR /app
COPY --from=util . ./shared/code/
COPY requirements.txt .
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN python -m pip install --upgrade pip && python -m pip install --no-compile --no-cache-dir -r requirements.txt 

FROM python:3.8-slim-bookworm AS base
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6 libgtk2.0-dev pkg-config -y

FROM base AS final
WORKDIR /app
COPY --from=builder /app .
COPY --from=builder /opt/venv /opt/venv

# Finish playwright install
RUN playwright install-deps && \
    playwright install

COPY . .
ENV PATH="/opt/venv/bin:$PATH"
CMD ["pytest", "--log-cli-level=DEBUG", "--junitxml=results.xml", "test.py"]
