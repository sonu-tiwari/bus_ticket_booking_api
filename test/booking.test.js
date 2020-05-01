const chai = require("chai");
const chaiHTTP = require("chai-http");
let expect = chai.expect;
const app = require("../index");
const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
chai.use(chaiHTTP);
describe("Booking a new ticket", () => {
  it("deleting the database", (done) => {
    User.deleteMany({}, (err) => {
      Ticket.deleteMany({}, (err) => {
        done();
      });
    });
  });
  it("/TICKET", (done) => {
    let ticket = {
      seat_number: 1,
      passenger: {
        name: "Sonu Tiwari",
        age: 23,
        sex: "M",
        email: "abc@example.com",
        phone: "1234567890",
      },
    };
    chai
      .request(app)
      .post("/api/ticket")
      .send(ticket)
      .end((err, response) => {
        expect(err).to.equal(null);
        expect(response).to.have.status(200);
        expect(response.body).to.be.an("object");
        done();
      });
  });
  it("/api/ticket", (done) => {
    let ticket = {
      seat_number: 0,
      passenger: {
        name: "Sonu Tiwari",
        age: 23,
        sex: "M",
        email: "abcdef@example.com",
        phone: "1234567895",
      },
    };
    chai
      .request(app)
      .post("/api/ticket")
      .send(ticket)
      .end((err, response) => {
        expect(err).to.equal(null);
        expect(response).to.have.status(204);
        expect(response.body).to.be.an("object");
        done();
      });
  });
  it("/tickets/1", (done) => {
    chai
      .request(app)
      .get("/api/ticket/1")
      .end((err, res) => {
        expect(err).equal(null);
        expect(res.body).to.be.an("object");
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty("status");
        done();
      });
  });
  it("PUT /api/ticket/1", (done) => {
    let ticket = {
      seat_number: 1,
      passenger: {
        name: "Sonu Tiwari",
        age: 23,
        sex: "M",
        email: "ankorha@example.com",
        phone: "9056360543",
      },
    };
    chai
      .request(app)
      .put("/api/ticket/1")
      .send(ticket)
      .end((err, res) => {
        expect(err).equal(null);
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty("message");
        done();
      });
  });
  it("Update User", (done) => {
    passenger = {
      name: "Sonu Tiwari",
      age: 23,
      sex: "M",
      email: "abc@example.com",
      phone: "9056360543",
    };
    chai
      .request(app)
      .put("/api/user/1")
      .send(passenger)
      .end((err, res) => {
        expect(err).equal(null);
        expect(res).to.have.status(202);
        expect(res.body).to.be.an("object");
        done();
      });
  });
  it("Get ticket status", (done) => {
    chai
      .request(app)
      .get("/api/ticket/1")
      .end((err, res) => {
        expect(err).equal(null);
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty("status");
        done();
      });
  });
  it("Get All Empty Seats List", (done) => {
    chai
      .request(app)
      .get("/api/tickets/open")
      .end((err, res) => {
        expect(err).equal(null);
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty("status");
        expect(res.body).to.haveOwnProperty("emptySeats");
        expect(res.body.emptySeats).to.be.an("array");
        done();
      });
  });
  it("Get All Booked Seats List", (done) => {
    chai
      .request(app)
      .get("/api/tickets/closed")
      .end((err, res) => {
        expect(err).equal(null);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });
  it("Get All User Details for a booked seat", (done) => {
    chai
      .request(app)
      .get("/api/ticket/details/1")
      .end((err, res) => {
        expect(err).equal(null);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        done();
      });
  });
  it("Reset Tickets No body", (done) => {
    chai
      .request(app)
      .post("/api/tickets/reset")
      .end((err, res) => {
        expect(err).equal(null);
        expect(res).to.have.status(400);
        expect(res.body).to.be.an("object");
        done();
      });
  });
  it("Reset Tickets Wrong ID", (done) => {
    chai
      .request(app)
      .post("/api/tickets/reset")
      .send({ username: "user", password: "adminpassword" })
      .end((err, res) => {
        expect(err).equal(null);
        expect(res).to.have.status(400);
        expect(res.body).to.be.an("object");
        expect(res.body.message).equal("username is incorrect");
        done();
      });
  });
  it("Reset Tickets Wrong Password", (done) => {
    chai
      .request(app)
      .post("/api/tickets/reset")
      .send({ username: "admin", password: "password" })
      .end((err, res) => {
        expect(err).equal(null);
        expect(res).to.have.status(400);
        expect(res.body).to.be.an("object");
        expect(res.body.message).equal("password did not match");
        done();
      });
  });
  it("Reset Tickets", (done) => {
    chai
      .request(app)
      .post("/api/tickets/reset")
      //.send({ username: "admin", password: "pwd" })
      .end((err, res) => {
        expect(err).equal(null);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.message).equal("successfully reset");
        done();
      });
  });
});
