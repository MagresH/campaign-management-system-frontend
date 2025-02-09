# Campaign Management System - Frontend

## Introduction

The **Campaign Management System** is an application designed to manage advertising campaigns for products sold by various sellers. This system allows sellers to create, edit, and delete campaigns for their products and manage their products.

## Features

- **Creating Sellers and Their Accounts**: The initial page allows the creation of seller profiles along with their associated accounts.

- **CRUD Product Management**: Provides full Create, Read, Update, Delete (CRUD) operations for managing products associated with sellers.

- **Starting Campaigns from Products**: From the product list, sellers can start creating campaigns for specific products.

- **CRUD Campaign Management**: Enables sellers to create, update, delete, and view advertising campaigns for their products.

- **Keyword Search Handling**: Supports searching for campaign keywords with an autocomplete feature based on the letters typed into the keywords field, fetching results from the backend.

- **Town List Sharing**: Offers a dropdown list of towns fetched from the backend to be used in campaigns.

- **Form Validation**: Includes validation mechanisms to ensure that data entered into forms is correct and complete before processing.

- **Navbar with Tabs**: Provides a navigation bar with tabs for `Products` and `Campaigns`.

- **Account Balance Display in Navbar**: Displays the current account balance in the navbar, which updates upon operations on campaigns (adding, updating campaign funds, or deleting campaigns).

- **Logout Button in Navbar**: Allows sellers to "log out" by deleting their profile and creating a new one, available in the navbar.

## Frontend Stack

The frontend of the **Campaign Management System** is built using the following technologies:

- **Angular**

- **Angular Material**

## Installation

To install and run the **Campaign Management System** frontend, follow these steps:

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Serve the application:**

    ```bash
    ng serve
    ```

These commands will install the necessary dependencies and run the application, ensuring that it is properly set up for development or production use.
