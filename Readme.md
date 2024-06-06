# Voting Application

This is a backend application for a voting system where users can vote for candidates. It provides functionalities for user authentication, candidate management, and voting.

## Features

- User Register with CitizenshipPhoto, CitzenshipId, Email ,Password and many more
- User can login with CitizenshipId,Email,Password
- User can view the list of candidates
- User can vote for a candidate (only once) note: AdminUser Can't vote
- Admin can manage candidates (add, update, delete)

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT) for authentication

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AnjanGhimire7/voting_app.git
   ```

# API Endpoints

## Authentication

### Regisering User

- `POST /api/v1/users/register`: Register a user

### Login

- `POST /api/v1/users/login`: Login a users

### Logout

- `POST /api/v1/users/logout`: Logout a user

## Candidates

### Get Candidates

- `GET /api/v1/candidates/allCandidate`: Get the list of candidates

### Add Candidate

- `POST /api/v1/candidates/registerCandidate`: adding the candidate User (Admin Only)

### Update Candidate

- `PUT /api/v1/candidates/:candidateID`: Update a candidate by ID (Admin only)

### Delete Candidate

- `DELETE /api/v1/candidates/:candidateID`: Delete a candidate by ID (Admin only)

## Voting

### Get Vote Count

- `GET /api/v1/candidates/vote/count`: Get the count of votes for each candidate

### Vote for Candidate

- `POST /api/v1/candidates/vote/:candidateID`: Vote for a candidate (User only)

## User

### Get All the user

- `GET /api/v1/users/allUser`: Get all the user

### Get Profile

- `GET /api/v1/users/profile`: Get user profile information

### Change Password

- `PUT /api/v1/users/profile/changePassword`: Change user password
