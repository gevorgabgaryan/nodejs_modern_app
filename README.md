# Node.js Modern App

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contact](#contact)

## Introduction

This repository contains a Dockerized setup for a microservices architecture using Node.js, MySQL, Redis, MongoDB, and RabbitMQ.



## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Installation

1. Clone the repository:

    - git clone https://github.com/gevorgabgaryan/nodejs_modern_app
    - cd nodejs_modern_app

## Configuration

 1. Create a .env file based on the provided env-sample file:

    - cp .env-sample .env

 2. Open the .env file in a text editor and fill
    in the required configuration values,
    such as database connection details:
    ```
        NODE_ENV=production
        PORT=3115
        WS_PORT=1990
        MONGO_DB_URL=mongodb://localhost:27017
        MONGO_DB_NAME=MODERN_APP
        JWTSECRET=GEVORG_ABAGRYAN
        SENDGRID_API_KEY=SENDGRID_API_KEY
        FROM_EMAIL=your@example.com
        GITHUB_CLIENT_ID=GITHUB_CLIENT_ID
        GITHUB_CLIENT_SECRET=GITHUB_CLIENT_SECRET
        REDIS_PORT=6379
        MYSQL_HOST="localhost"
        MYSQL_PORT=3306
        MYSQL_DB_NAME="online_shop"
        MYSQL_USERNAME="root"
        MYSQL_PASSWORD="yourpassword"
        TEST_USER="test@gmail.con"
        TEST_PASWORD=Test
    ```
    Adjust the values according to your specific setup.

## Usage
  1.  Build and start the application
      -  docker-compose up --build

  2. The application will be running on
      -  http://localhost:3115

## API Documentation


## Contact
   For any inquiries, please contact Gevorg
   at gevorg.gak@gmail.com