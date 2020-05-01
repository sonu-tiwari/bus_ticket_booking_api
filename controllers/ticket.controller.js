const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const dbConnection = require("../configs/db_config");
const bcrypt = require("bcrypt");
const { userValidation, openTicket } = require("../utilities/validation");
const TicketController = {};

/**
 * this function will be used to book ticket and register passenger.
 */
TicketController.bookTicket = async (req, res) => {
  const { seat_number } = req.body;
  if (Number(seat_number) < 1 || Number(seat_number) > 40) {
    return res.status(204).send({ status: 204, message: "Invlid Seat Number" });
  }
  const bookedTicket = await Ticket.find({ seat_number: req.body.seat_number });
  if (bookedTicket.length != 0)
    return res
      .status(204)
      .send({ status: 204, message: "This seat is already booked" });
  let [result, data] = userValidation(req.body.passenger);
  if (!result) return res.status(404).json({ message: data });
  const ticket = new Ticket({ seat_number: req.body.seat_number });
  const user = new User(req.body.passenger);
  user
    .save()
    .then((data) => {
      if (data) {
        ticket.passenger = user._id;
        ticket
          .save()
          .then((data) => res.status(200).json(data))
          .catch((err) => {
            User.findOneAndDelete({ _id: user._id })
              .then((data) => res.status(400))
              .catch((err) => res.status(400).json({ message: err }));
          });
      } else {
        return res.status(404).json({ message: err });
      }
    })
    .catch((err) => res.status(404).json({ message: err }));
};

/**
 * A method to update already existing tickets.
 */
TicketController.updateTicket = (req, res) => {
  //check indempotency for ticket booking status
  const { ticket_id } = req.params;
  const requestData = req.body;
  let passenger = null;

  if ("passenger" in requestData) {
    passenger = req.body.passenger;
  }
  if (!requestData.hasOwnProperty("is_booked")) {
    requestData.is_booked = true;
  }
  Ticket.findOne({ seat_number: ticket_id }, function (err, ticket) {
    if (err) return res.status(404).json({ message: err });
    else {
      const user_id = ticket.passenger._id;
      if (!requestData.is_booked) {
        // Booking is false so delete the entry.
        User.deleteOne({ _id: user_id }, (err) => {
          if (err) return res.status(404).json({ message: err });
          else
            Ticket.deleteOne({ _id: ticket._id }, (err) => {
              if (err) return res.status(404).json({ message: err });
              else
                return res
                  .status(200)
                  .json({ message: "Updated successfully" });
            });
        });
      } else {
        User.updateOne({ _id: user_id }, passenger, function (err, data) {
          if (err) {
            return res.status(404).json({ message: err });
          } else {
            return ticket
              .save()
              .then((data) => res.status(200).send({ message: data }))
              .catch((err) => res.status(404).json(err));
          }
        });
      }
    }
  });
};

/**
 * Edit passenger details.
 */
TicketController.editUserDetails = (req, res) => {
  const { ticket_id } = req.params;
  const payload = req.body;
  Ticket.findOne({ seat_number: ticket_id }, function (err, ticket) {
    if (err) res.status(404).json({ message: err });
    else {
      const user_id = ticket.passenger;
      User.findById(user_id)
        .then((user) => {
          if ("name" in payload) user.name = payload.name;
          if ("sex" in payload) user.sex = payload.sex;
          if ("email" in payload) user.email = payload.email;
          if ("phone" in payload) user.phone = payload.phone;
          if ("age" in payload) user.age = payload.age;
          user
            .save()
            .then((data) => res.status(202).json(data))
            .catch((err) => res.status(404).json({ message: err }));
        })
        .catch((err) => res.status(404).json({ message: err }));
    }
  });
};

/**
 * Get the status of the ticket.
 */
TicketController.getTicketStatus = (req, res) => {
  const { ticket_id } = req.params;
  Ticket.findOne({ seat_number: ticket_id }, function (err, ticket) {
    if (err) res.status(404).json({ message: err });
    else res.status(200).json({ status: ticket.is_booked });
  });
};

/**
 * Get all the empty seats.
 */
TicketController.getEmptySeats = (req, res) => {
  Ticket.find({}, (err, data) => {
    if (err) res.status(404).send({ status: 204, message: err });
    if (data) {
      let occupiedSeats = [];
      data.forEach((obj) => {
        occupiedSeats.push(obj.seat_number);
      });
      let emptySeats = [];
      for (let i = 1; i < 41; i++) {
        if (occupiedSeats.indexOf(i) == -1) {
          emptySeats.push(i);
        }
      }
      res.status(200).send({ status: 200, emptySeats: emptySeats });
    }
  });
};

/**
 * get all the booked seats.
 */
TicketController.bookedSeats = (req, res) => {
  Ticket.find({}, (err, data) => {
    if (err) res.status(404).json({ message: err });
    if (data) res.status(200).json(data);
  });
};

/**
 * get passenger details.
 */
TicketController.getUserDetails = (req, res) => {
  const { ticket_id } = req.params;
  Ticket.findOne({ seat_number: ticket_id }, function (err, ticket) {
    if (err) return res.status(404).json({ message: err });
    else {
      User.findOne({ _id: ticket.passenger }, function (err, user) {
        if (err) return res.status(404).json({ message: err });
        else return res.status(200).send({ user: user });
      });
    }
  });
};

/**
 * reset all the seats.
 */
TicketController.resetAllSeats = async (req, res) => {
  if (!("username" in req.body) && !("password" in req.body)) {
    return res
      .status(400)
      .json({ message: "username and password is needed in request body" });
  }

  const { username, password } = req.body;

  if (!(username === process.env.USER)) {
    return res.status(400).json({ message: "username is incorrect" });
  }

  if (!bcrypt.compareSync(password, process.env.ADMIN_PASSWORD_HASH)) {
    return res.status(400).json({ message: "password did not match" });
  }

  Ticket.deleteMany({}, (err, data) => {
    if (err) res.status(404).json({ message: err });
    else {
      User.deleteMany({}, (err, response) => {
        if (err) return res.status(404).json({ message: err });
        return res.status(200).json({ message: "successfully reset" });
      });
    }
  });
};

module.exports = TicketController;
