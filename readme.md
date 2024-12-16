# Soft Skills

Esta es una aplicación para el desarrollo de habilidades blandas. La aplicación consta de un frontend y un backend. A continuación se detallan los requerimientos y pasos para la instalación y funcionamiento de ambos.

## Requerimientos

### Frontend

- Node.js (v14 o superior)
- npm (v6 o superior) o yarn (v1 o superior)

### Backend

- Python 3.11.2
- pip (v24 o superior)

## Instalación

### Backend

1. Clona el repositorio :
   ```bash
   git clone https://github.com/Daniel-Cossio/TG2
   cd Back
   ```

Con python ya instalado ingresar a la carpeta Back y usar los siguientes comandos:

"Pip install poetry" o "Python -m pip install poetry"

"poetry shell"

"poetry install --no-root"

### Frontend

1. Clona el repositorio :
   ```bash
   git clone https://github.com/Daniel-Cossio/TG2
   cd Back
   ```

Ingresar a la carpeta Front/soft-skills-front y usar los siguientes comandos:

npm install package.json

y "npm start" para ejecutar.

### Estructura general del proyecto

TG2/
├── Back/ # Backend construido con FastAPI

│ ├── main.py # Punto de entrada del backend

│ ├── pyproject.toml # Dependencias del backend

│ └── ... # Otros archivos del backend

├── Front/ # Frontend construido con React

│ └── soft-skills-front/ # Aplicación frontend

└── README.md # Documentación del proyecto

# Diagrama de Arquitectura

A continuación se muestra un diagrama básico de la arquitectura para una aplicación que utiliza FastAPI en el backend, React en el frontend y una base de datos SQLite:

```plaintext
+---------------------+         +-------------------------+
|     Frontend        |         |       Backend           |
|     (React)         |         |      (FastAPI)          |
|                     |         |                         |
|   - UI Components   |         |   - RESTful API         |
|   - State Management| <-----> |   - Request Handling    |
|   - Routing         |   API   |   - Business Logic      |
|   - HTTP Requests   |         |   - Database Operations |
+---------------------+         +-------------------------+
                                    |
                                    |
                            +----------------+
                            |   Database      |
                            |    (SQLite)     |
                            +----------------+
```
