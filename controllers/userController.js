const ApiError = require('../error/ApiError');

const {Energy, Score, User, Price} = require('../models/models')


class UserController {
    
    async create(req, res, next) {
        const {userId, firstName, chatId, photoUrl, isAdmin} = req.body;
        const user = await User.findOne({where: {userId}})
        if (user) {
            return next(ApiError.badRequest('User already created.'))
        } else {
            const user = await User.create({userId, firstName, chatId, photoUrl, isAdmin})
            const score = await Score.create({user_id: userId})
            const energy = await Energy.create({user_id: userId})
            const price = await Price.create({user_id: userId})
            return res.json(user)
        }
    }
    
    async getAll(req, res) {
        let result = []
        let users = await User.findAll({attributes: ["userId", "firstName", "photoUrl"]})
        for (let user of users) {
            const score = await Score.findOne({where: {user_id: user.userId}, attributes: ["score"]})
            let userInfo = {
                userId: user.userId,
                firstName: user.firstName,
                photoUrl: user.photoUrl,
                userScore: score
            }
            result.push(userInfo)
        }
        return res.json(result)
    }

    async get(req, res) {
        const {id} = req.params
        const result = []
        const user =  await User.findOne({where: {userId: id}, attributes: ["userId", "firstName", "photoUrl", "isAdmin"]})
        const score = await Score.findOne({where: {user_id: id}, attributes: ["score", "scoreTapNumber", "updatedAt"]})
        const energy = await Energy.findOne({where: {user_id: id}, attributes: ["energy", "energyAddOnSeconds", "energyLossOnTap", "updatedAt"]})
        const price = await Price.findOne({where: {user_id: id}, attributes: ["vodka", "vadim", "ruslan"]})
        result.push({user, score, energy, price})
        return res.json(result)

    }

    async update(req, res, next) {
        const {id} = req.params
        const {score, scoreTapNumber, energy, energyAddOnSeconds, energyLossOnTap, vodka, vadim, ruslan} = req.body
        try {
            await Score.update({score, scoreTapNumber}, {where: {user_id: id}})
            await Energy.update({energy, energyAddOnSeconds, energyLossOnTap}, {where: {user_id: id}})
            await Price.update({vodka, vadim, ruslan}, {where: {user_id: id}})
            return res.json(JSON.stringify('Updated successfully.'))
        } catch (e) {
            return next(ApiError.badRequest('Update failed'))
        }
    }
}

module.exports = new UserController()