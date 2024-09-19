FROM tensorflow/tensorflow:2.12.0-gpu as runner
WORKDIR /app

# Install runtime system deps
RUN apt-get update && apt-get install -y ffmpeg libsm6 libxext6

# Setup venv. This removes root pip warnings/issues
# We can't use venvs as this breaks tensorflow, which comes with the base image
#RUN python -m venv /opt/venv
#ENV PATH="/opt/venv/bin:$PATH"

# Copy venv from builder
#COPY --from=builder /opt/venv /opt/venv

# Add copied venv to path
#ENV PATH="/opt/venv/bin:$PATH"

# Install deps
# TODO: Move this to a multistage build. I can't seem to do this without breaking opencv for some reason
COPY requirements.txt .
RUN python3 -m pip install --upgrade pip && python3 -m pip install --no-cache-dir -r requirements.txt 

# Copy additional data 
COPY --from=util . ./shared
COPY --from=validation . ./validation

# Copy source
COPY . .
CMD ["python3", "ai_driver.py"]
