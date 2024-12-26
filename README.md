---
# Molactyl

## Overview

Molactyl is a powerful and efficient dashboard built using **Bun**. It provides features like server creation, user management, an admin panel, a store, an AFK page, and the ability to scan available nodes and images.

---

## Prerequisites

Before getting started, ensure you have the following installed:

- **Git**: For cloning the repository.
- **Bun**: To manage dependencies and run the application. You can install Bun from [bun.sh](https://bun.sh).

---

## Installation

Follow the steps below to set up and run the Molactyl dashboard:

1. Clone the repository:
   ```bash
   git clone https://github.com/hydren-dev/Molactyl.git
   ```

2. Navigate into the project directory:
   ```bash
   cd Molactyl
   ```

3. Install dependencies using Bun:
   ```bash
   bun install
   ```

4. Configure the environment file:
   ```bash
   mv .env_exemple .env
   ```

   Edit the `.env` file to match your setup.

---

## Running the Panel

To start the Molactyl panel, use the following command:

```bash
bun run index.js
```

---

## Features

- **Server Creation**: Easily create and manage servers.
- **User Creation**: Manage users with a robust user system.
- **Admin Panel**: Powerful admin tools for managing your services.
- **Store**: Integrated store for handling purchases and upgrades.
- **AFK Page**: Dedicated page for AFK users.

---

## Scan Nodes and Images

- To **scan nodes** available on your system, go to:  
  `/scannodes`

- To **scan images** available for server creation, go to:  
  `/scanimages`

---

## Support

For any issues or suggestions, please open an issue on the [GitHub repository](https://github.com/hydren-dev/Molactyl).

---

## License

This project is licensed under the terms of the repository's license. Check the `LICENSE` file for details.
