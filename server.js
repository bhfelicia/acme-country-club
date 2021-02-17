const {
  db,
  Model: { Member, Booking, Facility },
  seed,
} = require("./db");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/api/members", async (req, res, next) => {
  try {
    const mems = await Member.findAll({
      include: [{ model: Member, as: "sponsor" }],
    });
    res.send(mems);
  } catch (error) {
    next(error);
  }
});

app.get("/api/facilities", async (req, res, next) => {
  try {
    const facilities = await Facility.findAll();
    res.send(facilities);
  } catch (error) {
    next(error);
  }
});

app.get("/api/bookings", async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      include: [Facility, { model: Member, as: "bookedBy" }],
    });
    res.send(bookings);
  } catch (error) {
    next(error);
  }
});

app.get("/api/member_bookings", async (req, res, next) => {
  try {
    res.send(
      await Booking.findAll({
        attributes: {
          exclude: ["startTime", "endTime", "createdAt", "updatedAt"],
        },
      })
    );
  } catch (error) {
    next(error);
  }
});

const init = async () => {
  try {
    await db.sync({ force: true });
    await seed();
    app.listen(PORT, () => console.log(`app listening on port: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
init();
