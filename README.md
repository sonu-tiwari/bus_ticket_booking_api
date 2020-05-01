# bus-ticket-booking

## A bus ticket booking api server build on express.js with MongoDB as the backend.

**-API docs:**

## [The API is live at Heroku](https://sonu-bus-ticket-booking.herokuapp.com/)

**-POST '/api/ticket'**

- Create a ticket in tickets collection and corresponding user in user collection with seat*number*
- All of the attributes are required\_
- data:
- <pre>{
    "seat_number": 1, -> possible values 1 to 40
    "passenger": { -> passenger details
      "name": "Sonu Tiwari",
      "sex": "M",
      "age": 23,
      "phone": "1234567890", -> has to be unique in the whole user collection, hence, primary key for users
      "email": "abc@gmail.com"
    }
  } </pre>
- returns:
  200: if success, returns object that was saved
  404: if fails returns error in this format {message:"error in string"}

**PUT '/api/ticket/:ticket_id'**

- _Edit the ticket details and/or the passenger details_
- _All the attributes are optional_
- Data:
- <pre>{
      "seat_number": 1, -> possible values 1 to 40
      "passenger": { -> passenger details
        "name": "Sonu Tiwari",
        "sex": "M",
        "age": 23,
        "phone": "1234567890",
        "email": "abc@gmail.com"
      }
    } </pre>
  <pre> returns:
  200: if success, returns object that was saved
  404: if fails returns error in this format {message:"error in string"}<pre>

**GET /api/ticket/:ticket_id**

<pre>
- Get the status of the ticket based on the ticket_id passed in URL_
- returns:
  200: if success, returns object that was saved
  404: if fails returns error in this format {message:"error in string"}
</pre>

**GET /api/tickets/open**

<pre>
- _Get a list of tickets which have is_booked: false, that is, are open_
- returns:
  200: if success, returns object that was saved
  404: if fails returns error in this format {message:"error in string"}
</pre>

**GET /api/tickets/closed**

<pre>
- Get a list of tickets which have is_booked: true, that is, are closed_
- returns:
  200: if success, returns object that was saved
  404: if fails returns error in this format {message:"error in string"}
</pre>

**GET /api/ticket/details/:ticket_id**

<pre>
- Get the user details of the ticket based on the ticket_id passed_
- returns:
  200: if success, returns object that was saved
  404: if fails returns error in this format {message:"error in string"}
</pre>

**POST /api/tickets/reset**

<pre>
- Open all the tickets that are in the DB_
- sets is_booked:false in all documents in tickets collection
</pre>
<pre>
- data:
- {
  "username": "admin",
  "password": "adminpassword"
  }
</pre>
<pre>
- returns:
  200: if success, returns object that was saved
  404: if fails returns error in this format {message:"error in string"}
</pre>

**Packages used**:

<pre>
- "bcrypt": used for hashing and storing comparing passwords
- "dotenv": to set process environment variables
- "express": for API building blocks
- "joi": Input validation middleware
- "mongoose": MongoDB ORM
- "mongoose-unique-validator":
- "mocha": testing library
- "chai": testing library
- "chai-http": testing http requests
</pre>
