## TinyLink Project

This project includes both the backend and the frontend for a fully functional tiny URL application. The goal of the system is to let users create tiny URLs manage them check their statistics and handle redirection smoothly. The backend stores all data and exposes APIs while the frontend presents everything in a simple dashboard.

## Backend Overview

The backend is created using Node Express TypeScript and MongoDB. The backend is responsible for storing all tiny links generating codes when necessary validating custom codes and tracking click counts. In the previous version the backend handled redirection directly. This has now been updated. The backend no longer performs the redirect itself. Instead the backend exposes an API endpoint that checks whether a given code exists in the database. When this endpoint is called it increments the click count and returns the target long URL to the frontend. The frontend then performs the actual browser redirection.

## Backend Features

Create tiny URLs and optionally allow custom codes.
Generate random codes when no custom code is provided.
Provide an API that receives a short code increments the click count and returns the original long URL if it exists.
Return an error response when a code does not exist.
Store created links in MongoDB.
Provide APIs for creating listing fetching by code and deleting.
Provide a health check endpoint.

## Frontend Overview

The frontend is built using React Vite TypeScript and Tailwind CSS. It works as a clean dashboard for managing all tiny URLs. Users can create new links view the entire list delete links and open a statistics page for each link. The most important change is that redirection now happens on the frontend. When someone clicks a tiny URL from the dashboard or enters a tiny URL on a dedicated page the frontend calls the backend to check the code. If the backend confirms the code exists the frontend redirects the browser to the target URL. If not it shows an error.

## Frontend Features

Create a new tiny URL by entering a long target URL.
Allow custom codes.
Display a list of all created tiny links.
Delete any link.
Show detailed statistics for each link on a separate page.
Call the backend redirection check API and then perform the redirect from the frontend.
Handle errors when a code does not exist.
Use React Router for page navigation.
Use Tailwind for styling.

## Redirection Flow

Redirection is no longer done on the backend.
When a user clicks a tiny link or opens a tiny link route the frontend first sends a request to the backend.
The backend increments the click count and responds with either the target URL or a not found response.
If the URL exists the frontend uses window location replace or assign to redirect the browser.
If the URL does not exist the frontend shows a message that the code is invalid.

## Environment Setup

The backend uses environment variables such as database URI port number and base URL.
The frontend uses an environment variable for the backend base URL.
Both systems require a dot env file.

## How To Run Backend

Install dependencies.
Configure environment variables.
Run npm run dev to start the development server.
Ensure MongoDB is running.

How To Run Frontend

## Install dependencies.
Create a dot env file with the backend URL.
Run npm run dev to start the development server.
Open the frontend in the web browser.

Notes

The backend must allow CORS for the frontend domain.
The frontend will not work unless the backend is running.
Redirection logic must always call the backend first to update click counts.
The frontend handles navigation to the target URL.

## Completion Status

Both backend and frontend are fully implemented.
Redirection now happens on the frontend based on backend API verification.
Statistics and link management functions are working as expected.