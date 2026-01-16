# EmbeddedDbRdbms
# For Angular/ES6+ offlime-apps

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.8.

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

To get the code, clone the repository URL into your drive. Make sure you gave git installed. You can also download a zip file of the project.

Open the project in VS Code or your favorite editor - IDE

# Development Environment - Node.js, npm, Angular CLI

You should have Angular installed once you have installed Node.js (contains npm)
Once your development environment is set up, you can run the app on your machine

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources - Manual

Once the app is runnning (after running #ng serve in bash, open your browser to http://localhost:4200 where you will see the live view of the app as an SQL console. You can run database queries here, create persistent databases, then create your own apps to use the databases by editting the project code.

### Database Queries Supported

# 1. show databases
# 2. create database your_db_name 
# 3. use your_db_name
# 4. create table your_table_name (your_column_name INT PRIMARY, another_column_name TEXT)
Available data types are INT, TEXT - you can add more types by editting the project code; available keys are PRIMARY and UNIQUE
# 5. show tables
# 6. CRUD - insert, update, delete, select - statements similar to normal SQL

#### The project is still under development. Feel free to contribute your ideas
## LIVE DEMO - https://ngrdbms.netlify.app

# Created by Bernard Katiku Mutua - katikumut@gmail.com - https://benkatiku.netlify.app - https://linkedin.com/in/katiku-mutua