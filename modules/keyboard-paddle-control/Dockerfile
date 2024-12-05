ARG CERTS=default

FROM python:3.11-slim-bookworm AS ssl_default

FROM ssl_default AS ssl_zscaler
COPY --from=certs . ./certs
RUN apt-get update -y && apt-get upgrade -y && apt-get install -y ca-certificates
RUN cp ./certs/zscaler.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates
ENV REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt

# base to speed up the build when only src changes
FROM ssl_${CERTS} AS base
WORKDIR /app
# Set the environment variable to noninteractive
ENV DEBIAN_FRONTEND=noninteractive
# Preconfigure the keyboard layout
RUN echo 'keyboard-configuration keyboard-configuration/layout select "English (US)"' | debconf-set-selections
RUN echo 'console-setup console-setup/charmap select UTF-8' | debconf-set-selections
ENV PATH="/opt/venv/bin:$PATH"

FROM base AS builder
ENV PYTHONDONTWRITEBYTECODE=1
WORKDIR /app
COPY requirements.txt .
RUN python -m venv /opt/venv
RUN python -m pip install --upgrade pip && python -m pip install --no-compile --no-cache-dir -r requirements.txt 
RUN python -m pip install --upgrade build

FROM base AS final
WORKDIR /app
COPY ./src .
COPY --from=builder /app .
COPY --from=builder /opt/venv /opt/venv

ENTRYPOINT ["python", "keyboard_paddle_control.py"]
