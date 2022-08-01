# 354-blood-bank

A blood bank database for CMPT 354 Group 26, Summer 2022.

View the app: https://best-354-app.herokuapp.com/ 

View the [documentation](https://docs.google.com/document/d/1TzZimKhZkYHa-XmhQ1VFtjhuz3x9eaKtt_QnMZm7K80/edit?usp=sharing)

## Project setup
Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.
### Install Dependencies
```
npm install
```

### Set up the local database
Connect to postgres with user password 'root'
```
psql -h localhost -U postgres
```

Create a database called 'bbdb'
```
CREATE DATABASE bbdb;
```

Connect to the database
```
\c bbdb;
```

Run the sql script to create and populate tables
```
\i table_setup.sql;
```

### Run locally
```
node index.js
```

The app should now be running on [localhost:5000](http://localhost:5000/).
