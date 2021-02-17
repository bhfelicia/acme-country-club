const { Sequelize, DataTypes, Model, UUID, UUIDV4 } = require("sequelize");
const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/acme_country_club"
);

class Member extends Model {}
class Facility extends Model {}
class Booking extends Model {}

Member.init(
  {
    id: {
      type: UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    first_name: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "members" }
);
Facility.init(
  {
    id: {
      type: UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    name: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "facilities" }
);
Booking.init(
  {
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "bookings" }
);

Facility.hasMany(Booking);
Booking.belongsTo(Facility);
Booking.belongsTo(Member, { as: "bookedBy" });
Member.hasMany(Booking, { foreignKey: "bookedById" });
Member.belongsTo(Member, { as: "sponsor" });
Member.hasMany(Member, { foreignKey: "sponsorId" });

const seed = async () => {
  const [larry, lucy, ethyl] = await Promise.all([
    Member.create({ first_name: "larry" }),
    Member.create({ first_name: "lucy" }),
    Member.create({ first_name: "ethyl" }),
  ]);
  const [golf, spa, lacrosse] = await Promise.all([
    Facility.create({ name: "golf" }),
    Facility.create({ name: "spa" }),
    Facility.create({ name: "lacrosse" }),
  ]);
  await Booking.create({
    startTime: `${new Date()}`,
    endTime: `
  ${new Date()}`,
    bookedById: lucy.id,
    facilityId: spa.id,
  });
  lucy.sponsorId = larry.id;
  await lucy.save();
};

module.exports = {
  db,
  Model: {
    Member,
    Facility,
    Booking,
  },
  seed,
};
