# This dockerfile was quickly made to dockerize the application it has not been optimized.
FROM python:3.8-slim-bookworm AS builder
ENV PYTHONDONTWRITEBYTECODE=1
WORKDIR /app
# COPY --from=util . ./shared
COPY requirements.txt .
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN python -m pip install --upgrade pip && python -m pip install --no-compile --no-cache-dir -r requirements.txt 

FROM python:3.8-slim-bookworm AS base
# Set the environment variable to noninteractive
ENV DEBIAN_FRONTEND=noninteractive
# Preconfigure the keyboard layout
RUN echo 'keyboard-configuration keyboard-configuration/layout select "English (US)"' | debconf-set-selections
RUN echo 'console-setup console-setup/charmap select UTF-8' | debconf-set-selections
# Install necessary packages
RUN apt-get update && apt-get install -y kbd

FROM base AS final
WORKDIR /app
COPY --from=builder /app .
COPY --from=builder /opt/venv /opt/venv
COPY . .
ENV PATH="/opt/venv/bin:$PATH"
CMD ["python", "keyboard_paddle_control.py"]
