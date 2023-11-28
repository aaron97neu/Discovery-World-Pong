# Use an official Python runtime as a parent image
FROM python:3.8-slim-buster AS base

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Use a second image to reduce the size of the final image
FROM python:3.8-slim-buster AS final

# Set the working directory to /app
WORKDIR /app

# Copy only the necessary files from the base image
COPY --from=base /app .

# Run app.py when the container launches
CMD ["python", "ai.py"]