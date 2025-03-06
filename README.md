# E-Commerce Backend

## Overview
This repository houses a robust and scalable backend for an e-commerce platform, designed with efficiency, security, and maintainability in mind. It serves as the foundation for a seamless online shopping experience, ensuring smooth transactions, secure authentication, and efficient product and order management.

## Features
- **User Authentication** – Secure registration, login, and JWT-based authentication.
- **Product Management** – Full CRUD operations for product catalog management.
- **Order Processing** – Order placement, tracking, and history retrieval.
- **Payment Integration** – Secure support for payment gateways (Stripe, PayPal, etc.).
- **Admin Dashboard** – Comprehensive management of users, products, and orders.
- **RESTful API** – Well-structured API endpoints for easy frontend integration.
- **Database Support** – Compatible with MongoDB/PostgreSQL for scalable data storage.
- **Security Measures** – Protection against SQL injection, XSS, and CSRF attacks.
- **Scalability** – Optimized for handling large product catalogs and high user traffic.

## Installation

### Prerequisites
Ensure your system has the following installed:
- Python 3.x
- Virtual environment (venv)
- PostgreSQL or MongoDB
- Git

### Setup Instructions

#### Clone the Repository
```sh
git clone https://github.com/sukanyaghosh74/ecommerce-backend_gdsc.git
cd ecommerce-backend
```

#### Create a Virtual Environment
- **For macOS/Linux:**
  ```sh
  python -m venv venv && source venv/bin/activate
  ```
- **For Windows:**
  ```sh
  python -m venv venv && venv\Scripts\activate
  ```

#### Install Dependencies
```sh
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the root directory and set up necessary database credentials and API keys.

#### Apply Database Migrations
```sh
python manage.py migrate
```

#### Start the Development Server
```sh
python manage.py runserver
```

## API Endpoints

### Authentication
- `POST /api/register/` – Register a new user
- `POST /api/login/` – Authenticate and retrieve a token

### Products
- `GET /api/products/` – Retrieve all products
- `POST /api/products/` – Add a new product (Admin only)
- `PUT /api/products/:id/` – Update product details (Admin only)
- `DELETE /api/products/:id/` – Remove a product (Admin only)

### Orders
- `POST /api/orders/` – Place a new order
- `GET /api/orders/` – Retrieve user order history

## Contribution Guidelines
We welcome contributions to enhance the functionality of this project. Follow these steps:
1. Fork the repository.
2. Create a feature branch:
   ```sh
   git checkout -b feature-name
   ```
3. Commit changes:
   ```sh
   git commit -m "Added feature XYZ"
   ```
4. Push to your branch:
   ```sh
   git push origin feature-name
   ```
5. Open a pull request for review.

## License
This project is licensed under the MIT License.

## Contact
For any questions, feature requests, or support, please open an issue or reach out via GitHub.
