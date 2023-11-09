# Chronos Attendance System Web Application - Server-side

**Chronos Attendance System Web Application - Server-side** is the backend component of the Chronos Attendance System, designed to work in conjunction with the [Chronos Attendance System Web Application](https://github.com/gifariarsal/chronos_client). This server-side repository is responsible for handling data storage, processing requests, and managing communication between the client-side application and the database.

## How to Use

Here are the steps to use this server-side code:

### Prerequisites
Make sure you have Node.js and npm (Node Package Manager) installed on your system before proceeding.

### Step 1: Clone the Repository
Clone this repository to your local system by running the following command in your terminal or command prompt:

```bash
git clone https://github.com/gifariarsal/chronos_server.git
```

### Step 2: Navigate to the Repository Directory
Navigate to the directory containing the cloned repository by using the `cd` command:

```bash
cd chronos_server
```

### Step 3: Install Dependencies
Install all the dependencies by running the following command:

```bash
npm install
```

### Step 4: Configure the Database
Copy the `.env-template` file to `.env` in the same directory and adjust the database configuration settings in the `.env` file according to your MySQL server settings:

```plaintext
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database_name
DB_HOST=your_host
PORT=8000

NODEMAILER_USER=your_email_username
NODEMAILER_PASS=your_email_password

JWT_KEY=your_jwt_secret_key
```

Replace `your_username`, `your_password`, `your_database_name`, `your_host`, `your_email_username`, `your_email_password`, and `your_jwt_secret_key` with the appropriate values matching your setup. Set `PORT` to `8000`.

### Step 5: Run the Server with Nodemon (Recommended)
Ensure that you have Nodemon installed. If not, you can install it globally using the following command:

```bash
npm install -g nodemon
```

After installing Nodemon, start the server with the following command:

```bash
nodemon
```

The server will run at `http://localhost:8000`. Ensure that the server is running and accessible before using the Chronos Attendance System Web Application.

### Additional Notes
This server-side component is designed to work seamlessly with the [Chronos Attendance System Web Application](https://github.com/gifariarsal/chronos_client). Make sure the client-side application is properly configured to communicate with this server. If you encounter any difficulties or issues, please refer to the server documentation or check the client-side repository for further assistance.

Feel free to ask questions or report issues via [Issues](https://github.com/gifariarsal/chronos_server/issues) if you need additional help.

Thank you for using the Chronos Attendance System Web Application - Server-side!