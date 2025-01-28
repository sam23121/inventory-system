# Project Title

## Table of Contents
- [Creating a Virtual Environment](#creating-a-virtual-environment)
- [Installing Dependencies](#installing-dependencies)
- [Folder Structure](#folder-structure)
- [Running the FastAPI App](#running-the-fastapi-app)
- [API Documentation](#api-documentation)

## Creating a Virtual Environment

To create a virtual environment with uv, navigate to your project directory and run the following command:

```bash
pip install uv
uv venv myenv --python 3.9
```

This will create a new directory called `myenv` that contains the virtual environment.

## Installing Dependencies

Once the virtual environment is created, activate it:

- On Windows:
  ```bash
  myenv\Scripts\activate
  ```

- On macOS/Linux:
  ```bash
  source myenv/bin/activate
  ```

After activating the virtual environment, install the required packages using pip:

```bash
uv pip install -r requirements.txt
```

## Folder Structure

Here's a brief overview of the folder structure:

* **`alembic/`**:  Handles database migrations using Alembic.
    * `env.py`:  Configures the Alembic environment.
    * `README`: Alembic-specific instructions.
    * `script.py.mako`: Template for migration scripts.
    * `versions/`: Stores migration files.
* **`alembic.ini`**: Configuration file for Alembic.
* **`app/`**: Core application logic.
    * **`api/`**:  Contains API endpoints.
        * **`v1/`**: Versioned API endpoints.
            * `api.py`:  Initialization and routing for the API.
            * **`endpoints/`**:  Specific endpoint implementations.
                * `documents.py`:  Endpoints related to documents.
                * `items.py`: Endpoints related to items.
                * `transactions.py`: Endpoints related to transactions.
                * `users.py`: Endpoints related to user management.
    * **`core/`**: Core application settings and utilities.
        * `config.py`: Application configuration.
        * `__init__.py`: Initialization file for the core module.
        * `security.py`: Security-related functions (e.g., authentication).
    * **`db/`**: Database related functions.
        * `base.py`: Base classes for database models.
        * `init_db.py`: Database initialization logic.
        * `__init__.py`: Initialization file for the db module.
        * `init_script.py`: Any initial script to be run at start. (Already ran it not neccessary to run it again)
        * `session.py`: Database session management.
    * **`models/`**: Database models definitions using SQLAlchemy.
        * `base.py`:  SQLAlchemy declarative base.
        * `__init__.py`: Initialization file for the models module.
        * `models.py`: Core data models (e.g., User, Item).
    * **`schemas/`**: Pydantic schemas for data validation and serialization.
        * `__init__.py`: Initialization file for the schemas module.
        * `schemas.py`:  Data schemas.
    * `__init__.py`:  Initialization file for the app module.
* **`main.py`**: Main application entry point (using FastAPI).
* **`README.md`**: This file, providing an overview of the project structure.
* **`requirements.txt`**: Project dependencies.

## Running the FastAPI App

To run the FastAPI application, ensure your virtual environment is activated and execute the following command:

```bash
uvicorn main:app --reload
```

This will start the server, and you can access the application at `http://127.0.0.1:8000`.

## API Documentation

FastAPI automatically generates documentation for your API. You can access it by navigating to:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

These interfaces allow you to test the API endpoints and view the documentation.


## Additional Notes

Make sure to add the env file at the root directory along the main.py file