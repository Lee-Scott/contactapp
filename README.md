# Contact Chat Application

## Overview

The **Contact Chat Application** is a platform that allows users to manage contacts and engage in interactive conversations. The application supports adding contacts, chatting with them, and facilitating conversations between contacts. The system is powered by a Spring Boot backend, while the frontend is built using Bootstrap. The application integrates with OpenAI for conversational AI features, with the OpenAI API key securely stored in the backend.

**Frontend Repository:** [https://github.com/Lee-Scott/contactapp](https://github.com/Lee-Scott/contactapp)  
**Backend API Repository:** [https://github.com/Lee-Scott/contactApi](https://github.com/Lee-Scott/contactApi)

---

## Features

- **Add Contacts**: Users can add new contacts with relevant details.
- **Engage in Conversations**: Chat with individual contacts or let contacts talk to each other.
- **OpenAI Integration**: Secure authentication for OpenAI key, enabling conversation AI features.
- **Responsive Design**: The frontend uses Bootstrap to ensure the application is mobile-friendly and responsive.

---

## Technical Requirements

Before running the application, make sure you have the following installed:

- **PostgreSQL**: To store contact data.
- **Node.js** and **npm**: For managing frontend and backend dependencies.
- **Java** (for Spring Boot): To run the backend API.

---

## Getting Started

Follow these steps to set up the Contact Chat Application:

### 1. Install PostgreSQL

- Install PostgreSQL on your local machine from the [official website](https://www.postgresql.org/download/).
- Once installed, create a new database for the application. You can do this through the PostgreSQL shell or a GUI tool like pgAdmin.

### 2. Clone the Repositories

- **Clone the Frontend Repository**:
  ```bash
  git clone https://github.com/Lee-Scott/contactapp
  cd contactapp
  ```

- **Clone the Backend Repository**:
  ```bash
  git clone https://github.com/Lee-Scott/contactApi
  cd contactApi
  ```

### 3. Configure the Backend API

- Ensure the backend is connected to your PostgreSQL database.
- Set up the OpenAI API key by storing it securely in your environment variables (refer to the backend repository for detailed instructions).

### 4. Install Backend Dependencies

- In the **backend directory**, install dependencies:
  ```bash
  npm install
  ```

### 5. Start the Backend API

- Start the backend server:
  ```bash
  npm start
  ```

- By default, the backend will be accessible at [http://localhost:8080](http://localhost:8080).

### 6. Install Frontend Dependencies

- In the **frontend directory**, install Bootstrap and other required dependencies:
  ```bash
  cd ../contactapp
  npm install bootstrap
  npm install
  ```

### 7. Start the Frontend

- Start the frontend application:
  ```bash
  npm start
  ```

- The frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## API Documentation

The backend API is documented using Swagger, which provides an interactive interface for testing API endpoints.

- Access the API documentation by navigating to:
  [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## Frontend Components

The frontend is built using **Bootstrap** and includes the following key components:

- **Contact List**: Displays a list of all contacts, allowing users to select contacts to interact with.
- **Conversation View**: Displays ongoing conversations with a contact or between contacts.
- **Add Contact Form**: A form to add new contacts to the system.
- **Responsive Layout**: Ensures the application is usable across different device sizes.

---

## Security

- The OpenAI API key is stored **securely** in the backend (not exposed in the frontend). I save it as an environment variable in my IDE.
- The backend API integrates securely with OpenAI for conversation generation, handling authentication through environment variables.

---

## Best Practices

- **Commit Messages**: Use clear and concise commit messages following [conventional commits](https://www.conventionalcommits.org/).
- **Code Style**: Follow consistent coding styles (e.g., indentation, naming conventions) throughout the project.
- **Documentation**: Provide thorough documentation for both the backend API and frontend components. This includes usage instructions and descriptions for each endpoint and UI component.
- **Version Control**: Use Git for version control, and ensure proper branch management (e.g., using `feature/`, `bugfix/`, and `hotfix/` branches).

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

## Troubleshooting

- **Issue with PostgreSQL connection**: Ensure PostgreSQL is running and the connection details (username, password, database name) are correctly configured in the backend application properties.
- **Missing dependencies**: If you encounter issues with missing packages or modules, try deleting `node_modules` and reinstalling them using `npm install`.
- **Backend not starting**: Ensure that Java is properly configured and the required environment variables (e.g., OpenAI key) are set.

---

## Contributing

Feel free to fork the repository and submit pull requests. When contributing, please ensure that:

- New features are accompanied by tests.
- Code adheres to the project's coding style.
- Pull requests are accompanied by clear descriptions of changes and their purpose.

---

By following these steps, you can set up and run the Contact Chat Application locally. If you run into issues, please check the troubleshooting section or open an issue on the GitHub repository.

---