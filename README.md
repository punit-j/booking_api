# booking_api

## To add dummy data
`npx sequelize-cli db:seed:all --mjs`

## To run the application
- `cd src`
- `node app.js`

## Things to note
The code base contains a docker compose which can be used to spin up mssql database, used in the app.

## Things to improve
- create enum for Agent's role.
- add error handling for post api correctly.
- add more tests, to get code coverage, currently the app is tested already mannually.
- add logger in place of console log, to get proper logging.