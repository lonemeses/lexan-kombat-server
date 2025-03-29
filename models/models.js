const seqilize = require('../db')
const {DataTypes} = require('sequelize')

const User = seqilize.define('user', {
    userId: {type: DataTypes.INTEGER, allowNull: false, unique: true, primaryKey: true},
    firstName: {type: DataTypes.STRING, allowNull: false},
    chatId: {type: DataTypes.INTEGER, allowNull: false, unique: true, defaultValue: 0},
    photoUrl: {type: DataTypes.STRING, allowNull: false, unique: true},
    isAdmin: {type: DataTypes.BOOLEAN, allowNull: false, default: false},
})
const Score = seqilize.define('scores', {
    score: {type: DataTypes.INTEGER, defaultValue: 0},
    scoreTapNumber: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
})

const Energy = seqilize.define('energy', {
    energy: {type: DataTypes.INTEGER, defaultValue: 3000},
    energyAddOnSeconds: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
    energyLossOnTap: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
})

const Price = seqilize.define('price', {
    vodka: {type: DataTypes.INTEGER, defaultValue: 100, allowNull: false},
    vadim: {type: DataTypes.INTEGER, defaultValue: 100, allowNull: false},
    ruslan: {type: DataTypes.INTEGER, defaultValue: 100, allowNull: false},
})

User.hasOne(Score, {foreignKey: 'user_id'})
Score.belongsTo(User, {foreignKey: 'user_id'})

User.hasOne(Energy, {foreignKey: 'user_id'})
Energy.belongsTo(User, {foreignKey: 'user_id'})

User.hasOne(Price, {foreignKey: 'user_id'})
Price.belongsTo(User, {foreignKey: 'user_id'})

module.exports = {
    User,
    Score,
    Energy,
    Price
}