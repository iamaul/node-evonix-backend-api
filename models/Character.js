const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const User = require('./User');
const Faction = require('./Faction');

const Character = database.define('Character', {
    userid: {
        type: DataTypes.INTEGER(11),
        references: {
            model: User,
            key: 'id'
        }
    },
    name: { type: DataTypes.STRING(24) },
    lastlogin: { type: DataTypes.INTEGER },
    skin_id: { type: DataTypes.INTEGER },
    gender: { type: DataTypes.TINYINT },
    birth_day: { type: DataTypes.MEDIUMINT },
    birth_month: { type: DataTypes.MEDIUMINT },
    birth_year: { type: DataTypes.INTEGER },
    level: { type: DataTypes.INTEGER },
    exp: { type: DataTypes.INTEGER },
    play_second: { type: DataTypes.INTEGER },
    play_minute: { type: DataTypes.INTEGER },
    play_hour: { type: DataTypes.INTEGER },
    pos_int: { type: DataTypes.INTEGER },
    pos_world: { type: DataTypes.INTEGER },
    pos_x: { type: DataTypes.FLOAT },
    pos_y: { type: DataTypes.FLOAT },
    pos_z: { type: DataTypes.FLOAT },
    pos_a: { type: DataTypes.FLOAT },
    money: { type: DataTypes.INTEGER },
    bank: { type: DataTypes.INTEGER },
    bank_saving: { type: DataTypes.INTEGER },
    paycheck: { type: DataTypes.INTEGER },
    max_health: { type: DataTypes.FLOAT },
    health: { type: DataTypes.FLOAT },
    armour: { type: DataTypes.FLOAT },
    death_mode: { type: DataTypes.TINYINT },
    phone_number: { type: DataTypes.INTEGER },
    phone_status: { type: DataTypes.INTEGER },
    job_type: { type: DataTypes.TINYINT },
    job_duty: { type: DataTypes.TINYINT },
    job_skin: { type: DataTypes.TINYINT },
    job_lastskin: { type: DataTypes.TINYINT },
    job_exp: { type: DataTypes.TINYINT },
    job_level: { type: DataTypes.TINYINT },
    job_timer: { type: DataTypes.TINYINT },
    faction_sqlid: { type: DataTypes.INTEGER },
    faction_rank: { type: DataTypes.INTEGER },
    faction_rankname: { type: DataTypes.STRING(30) },
    faction_div: { type: DataTypes.INTEGER },
    faction_divname: { type: DataTypes.STRING(30) },
    faction_duty: { type: DataTypes.TINYINT },
    faction_dutytime: { type: DataTypes.INTEGER },
    faction_dutypaycheck: { type: DataTypes.INTEGER },
    faction_skin: { type: DataTypes.INTEGER },
    handcuff_status: { type: DataTypes.TINYINT },
    garbage: { type: DataTypes.INTEGER },
    tutorial: { type: DataTypes.TINYINT },
    radio_main: { type: DataTypes.TINYINT },
    drug_addiction: { type: DataTypes.FLOAT },
    drug_addiction_timer: { type: DataTypes.INTEGER },
    license_driving: { type: DataTypes.INTEGER },
    license_flying: { type: DataTypes.INTEGER },
    license_sailing: { type: DataTypes.INTEGER },
    admin_jail_timer: { type: DataTypes.INTEGER },
    admin_jail_issuer: { type: DataTypes.STRING(24) },
    admin_jail_reason: { type: DataTypes.STRING(100) },
    jail_sentence: { type: DataTypes.INTEGER },
    jail_timer: { type: DataTypes.INTEGER },
    jail_arrest_sqlid: { type: DataTypes.INTEGER },
    prison_sentence: { type: DataTypes.INTEGER },
    prison_timer: { type: DataTypes.INTEGER },
    prison_arrest_sqlid: { type: DataTypes.INTEGER },
    mask_status: { type: DataTypes.TINYINT },
    mask_number: { type: DataTypes.INTEGER }
}, { tableName: 'characters' });

User.hasMany(Character, { foreignKey: 'userid', as: 'userChars' });
Character.belongsTo(User, { foreignKey: 'userid', as: 'charUser' });
Character.belongsTo(Faction, { foreignKey: 'faction_sqlid', as: 'charFaction' });

module.exports = Character;