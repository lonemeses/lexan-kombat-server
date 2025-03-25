const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')

router.post('/', userController.create)
router.get('/:id', userController.get)
router.get('/', userController.getAll)
router.patch('/:id', userController.update)

module.exports = router