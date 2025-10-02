# Centralize Barangay Management Information System (CBMIS)

This is a web-based application for managing barangay information, including constituents, blotters, and printable documents.

## Features

*   **Frontend**:
    *   React framework
    *   DaisyUI components
    *   Login and Dashboard pages
    *   Sidebar navigation
    *   Printable documents (Barangay Clearance, Certificate of Indigency)
*   **Backend**:
    *   Laravel framework
    *   API routes for all frontend requirements
    *   Database migrations and seeders
*   **Database**:
    *   MySQL
*   **Docker**:
    *   `docker-compose.yml` for easy setup and deployment

## Setup

### Prerequisites

*   Docker
*   Docker Compose

### Instructions

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory**:
    ```bash
    cd pentatech-cbmis-app
    ```
3.  **Build and run the Docker containers**:
    ```bash
    docker-compose up -d --build
    ```
4.  **Install backend dependencies**:
    ```bash
    docker-compose exec app composer install
    ```
5.  **Run database migrations and seeders**:
    ```bash
    docker-compose exec app php artisan migrate:fresh --seed
    ```
6.  **Access the application**:
    *   **Frontend**: `http://localhost:5173`
    *   **Backend**: `http://localhost:8080`

## Operating Information

*   **Default User**:
    *   **Email**: `admin@example.com`
    *   **Password**: `password`
*   **API Endpoints**:
    *   `/api/login`
    *   `/api/logout`
    *   `/api/stats`
    *   `/api/constituents`
    *   `/api/blotters`
