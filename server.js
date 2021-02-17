const { Sequelize, DataTypes, Model, UUID, UUIDV4 } = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_country_club');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

class Member extends Model {};
class Facility extends Model {};
class Bookings extends Model {};

Member.init({
    id : {
        type: UUID,
       primaryKey: true,
       defaultValue: UUIDV4 
    },
    first_name : {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false

    }
}, {sequelize:db, modelName:'members'});
Facility.init({
    id: {
        type: UUID,
        primaryKey:true,
        defaultValue: UUIDV4
    },
    name : {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    }
}, {sequelize:db, modelName:'facilities'})
Bookings.init({
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    },

}, {sequelize:db, modelName:'bookings'});

Facility.hasMany(Bookings);
Bookings.belongsTo(Facility);
Bookings.belongsTo(Member);
Member.hasMany(Bookings);
Member.belongsTo(Member, { as: 'sponsor'});
Member.hasMany(Member, {foreignKey: 'sponsorId'})

const init = async () => {
    await db.sync({ force: true});

    app.listen(PORT, () => console.log(`app listening on port: ${PORT}`))
}
init();