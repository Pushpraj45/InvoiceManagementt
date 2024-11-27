# Invoice Management System

A full-stack Invoice Management System with a Django REST Framework backend and React frontend.

## Author  
**Tanjul Sarathe**  
Email: [sarathetanjul@gmail.com](mailto:sarathetanjul@gmail.com)  

Deployed Project: [Live Demo](https://invoice-mgmt-system-frontend-tanjul.vercel.app/)  

---

## Features  

### Backend  
- **Models**:  
  1. **Invoice**  
      - `id`: Auto-incremented primary key  
      - `invoice_number`: CharField (unique)  
      - `customer_name`: CharField  
      - `date`: DateField  

  2. **InvoiceDetail**  
      - `id`: Auto-incremented primary key  
      - `invoice`: ForeignKey to Invoice  
      - `description`: CharField  
      - `quantity`: IntegerField (positive)  
      - `unit_price`: DecimalField  
      - `line_total`: DecimalField (computed field)  

- **API Requirements**:  
  - **URL**: `/api/invoices/`  
  - **Methods**: `GET`, `POST`, `PUT`, `DELETE`  

- **Key Features**:  
  1. Create/Update invoice with details in a single request  
  2. Validation for all fields  
  3. Auto-compute `line_total` and `total_amount`  
  4. Pagination for `GET` requests  
  5. Detailed error messages  

---

### Frontend  
- Responsive invoice management interface  
- Features:  
  1. Invoice list view with pagination  
  2. Create/Edit invoice form  
  3. Delete invoice functionality  
  4. Basic search and filter options  

---

## Tech Stack  

- **Frontend**: React, Vite, TailwindCSS  
- **Backend**: Django REST Framework, PostgreSQL  
- **Deployment**: Vercel  

---

## Setup  

### Frontend  

1. Initialize the React app using Vite:  
    ```bash
    npm create vite@latest frontend -- --template react
    cd frontend
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```

2. Configure TailwindCSS:  
    ```javascript
    // tailwind.config.js
    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```

3. Add Tailwind directives in your CSS:  
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

4. Run the development server:  
    ```bash
    npm run dev
    ```

5. For deployment, add `vercel.json` to the `frontend` folder:  
    ```json
    {
      "routes": [
        {
          "src": "/[^.]+",
          "dest": "/"
        }
      ]
    }
    ```

---

### Backend  

1. Set up the virtual environment:  
    ```bash
    python -m venv env
    .\env\scripts\activate
    pip install -r requirements.txt
    django-admin startproject backend
    ```

2. Create the `invoices` app:  
    ```bash
    cd backend
    python manage.py startapp invoices
    ```

3. Perform migrations:  
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

4. Configure `.env` for PostgreSQL database:  
    ```
    DB_NAME=""
    DB_USER=""
    DB_PWD=""
    DB_HOST=""
    DB_PORT=1212
    ```

5. Run the backend server locally:  
    ```bash
    python manage.py runserver
    ```

6. For deployment, add `vercel.json` to the `backend` folder:  
    ```json
    {
      "builds": [
        {
          "src": "backend/wsgi.py",
          "use": "@vercel/python",
          "config": {
            "maxLambda": "15mb",
            "runtime": "python3.10.4"
          }
        }
      ],
      "routes": [
        {
          "src": "/(.*)",
          "dest": "backend/wsgi.py"
        }
      ]
    }
    ```

---
## Deployment  

1. **Frontend**: [Vercel Deployment](https://invoice-mgmt-system-frontend-tanjul.vercel.app/)  
2. **Backend**: [Vercel Deployment](https://invoice-mgmt-system-backend-tanjul.vercel.app/)  

### Bonus Features (Optional)  
- Unit tests for both frontend and backend  
- Docker configuration  
- Live deployment (Heroku, Railway, etc.)  
