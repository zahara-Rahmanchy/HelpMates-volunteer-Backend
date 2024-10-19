# Pet Adoption System- PawFectMatch

### Tech Stack

    - Typescript
    - Express JS
    - Node JS
    - Postgres
    - Prisma

### Description & Features

    - The Pet Adoption System:PawFectMatch is an application which helps adoption process
      of animals. It connects users to potential adopters. Users can store pet informations and also can request for pet adoption.

    - Users can register using name,email and password.

    - Authentication is done using jwt for secure authentication and authorization.

    - Users(pet owners) can add their pet details,get pet details and update them

    - Users can make adoption requests which includes information about user,petId and
      pet ownership experience and status of the request.

    - The status of the adoption request is updated based on the user,updating status
      to rejected,accepted or default value which is pending.

    - Users can view and update their user profile informations

## To run the file locally perform the following steps

### Clone the repository using the command

    - git clone https://github.com/Porgramming-Hero-web-course/l2-b2-fullstack-track-assignment-8-zahara-Rahmanchy.git
    - cd my-repo
    - npm install

### Create a .env file and add the following

    - DATABASE_URL= postgresSQL url
    - JWT_SECRET=
    - EXPIRES_In=
    - ALGORITHM =

### Use the following command to start the application

    - npm run build
    - npm start

### Live Link

- https://assignment-8-cyan.vercel.app
