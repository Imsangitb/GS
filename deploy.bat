@echo off
echo Deploying Glossify Store with Docker...

REM Check if .env file exists
if not exist .env (
  echo Error: .env file not found. Please create one from .env.production.template
  exit /b 1
)

REM Pull latest changes from repository
echo Pulling latest changes...
git pull

REM Build and start the containers in detached mode
echo Building and starting Docker containers...
docker-compose up --build -d

REM Display container status
echo Container status:
docker-compose ps

echo Deployment completed successfully!
echo Your application is running at http://localhost:3000