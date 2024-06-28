# Wattwise: AI driven predictive analytics and energy consumption monitoring

An intuitive platform designed to enhance energy management by integrating diverse consumption data and offering advanced forecasting capabilities.

## Demo Version and Credentials

A demo version based on this branch can be accessed at [Wattwise Demo Site](https://wattwise.csd.auth.gr/).

### Credentials

| User Email             | Password     |
|------------------------|--------------|
| user1@example.com      | Pass1234!    |
| user2@example.com      | Pass1234!    |
| user3@example.com      | Pass1234!    |
| user4@example.com      | Pass1234!    |
| user5@example.com      | Pass1234!    |
| user6@example.com      | Pass1234!    |
| user7@example.com      | Pass1234!    |
| user8@example.com      | Pass1234!    |
| user9@example.com      | Pass1234!    |
| user10@example.com     | Pass1234!    |


| Provider Email             | Password     |
|------------------------|--------------|
| provider@example.com      | Pass1234!    |

| Admin Email             | Password     |
|------------------------|--------------|
| superuser@example.com      | Pass1234!    |

## System Architecture

The system architecture, depicted in Figure 1, comprises nine services. Each service is independent and extensible, ensuring that the system remains adaptable and future-proof. This design choice enhances the platform's ability to evolve and incorporate new advancements without disrupting existing functionalities.

### Frontend

This component is the graphical user interface of the application, accessible by users to examine insights and visualizations. It uses React, alongside Vite for optimized build tooling, and Tailwind CSS for responsive, design-forward components.

### Backend

Serving as the core of the system, the backend manages user authentication and authorization, serves content to the frontend, and functions as an API, simplifying data exchange between the data analysis and the database. It is built using Django, a high-level Python web framework, and Django Rest Framework (DRF) for RESTful architecture.

### Database

The database acts as the central repository for the system, storing critical user authentication information and application data. It is a setup of PostgreSQL equipped with the TimescaleDB plugin for efficient analysis of time-series data.

### Task Scheduler

Operating as the orchestrator, this service is responsible for task assignment and job scheduling across the system. The Task Scheduler, operating alongside Redis, is tasked with systematically distributing jobs to various workers: Consumption, Aggregation, Clustering, and Forecasting.

### Redis

Redis is used as a message broker for queuing jobs from the Task Scheduler, which are then processed by the worker services.

### Clustering Worker

This worker uses clustering algorithms, such as K-means, to determine the cluster to which a consumer belongs based on various personal details.

### Consumption Worker

Assigned the role of acquiring consumption data, this worker executes tasks queued in Redis and communicates with the backend for data transactions.

### Forecasting Worker

Responsible for generating forecasts based on consumption data, ensuring the forecasted data is stored in the database. It uses a wide range of Machine Learning (ML) and Deep Learning (DL) models.

### Aggregation Worker

This worker aggregates data within the database, optimizing it for better utility in the application by pre-computing statistical aggregations of consumption data.

---
