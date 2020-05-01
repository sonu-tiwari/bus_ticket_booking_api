const express = require("express");
const ticketController = require("../controllers/ticket.controller");
const router = express.Router();

//create a ticket
router.post("/ticket", ticketController.bookTicket);

//update a ticket, update open/closed and user_details
router.put("/ticket/:ticket_id", ticketController.updateTicket);

// edit details of a user
router.put("/user/:ticket_id", ticketController.editUserDetails);

// get the status of a ticket based on ticket_id
router.get("/ticket/:ticket_id", ticketController.getTicketStatus);

// get list of all open tickets
router.get("/tickets/open", ticketController.getEmptySeats);

// get list of all closed tickets
router.get("/tickets/closed", ticketController.bookedSeats);

// View person details of a ticket
router.get("/ticket/details/:ticket_id", ticketController.getUserDetails);

// Reset Tickets
router.post("/tickets/reset", ticketController.resetAllSeats);

module.exports = router;
