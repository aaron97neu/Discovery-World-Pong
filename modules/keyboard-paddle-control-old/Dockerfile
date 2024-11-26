# base to speed up the build when only src changes
FROM python:3.11-slim-bookworm AS base
WORKDIR /app
# Set the environment variable to noninteractive
ENV DEBIAN_FRONTEND=noninteractive
# Preconfigure the keyboard layout
RUN echo 'keyboard-configuration keyboard-configuration/layout select "English (US)"' | debconf-set-selections
RUN echo 'console-setup console-setup/charmap select UTF-8' | debconf-set-selections
# Install necessary packages
RUN apt update -y && apt upgrade -y && apt install -y kbd
ENV PATH="/opt/venv/bin:$PATH"

FROM base AS builder
ENV PYTHONDONTWRITEBYTECODE=1
WORKDIR /app
COPY --from=util ./py_packages ./py_packages
COPY requirements.txt .
RUN python -m venv /opt/venv
RUN python -m pip install --upgrade pip && python -m pip install --no-compile --no-cache-dir -r requirements.txt 
RUN python -m pip install --upgrade build
RUN python -m build py_packages
RUN python -m pip install ./py_packages/dist/dw-0.2.0-py3-none-any.whl

FROM base AS final
WORKDIR /app
COPY ./src .
COPY --from=builder /app .
COPY --from=builder /opt/venv /opt/venv

ENTRYPOINT ["python", "keyboard_paddle_control.py"]
