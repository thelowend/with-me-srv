const controller = require('./controller')
const Router = require('express').Router
const router = new Router()

router.route('/')
  .get((...args) => controller.find(...args))
  .post((...args) => controller.create(...args))

router.route('/:id')
  .put((...args) => controller.updateOne(...args))
  .patch((...args) => controller.update(...args))
  .get((...args) => controller.findById(...args))
  .delete((...args) => controller.remove(...args))

router.route('/:id/evaluation/:category')
  .put((...args) => controller.updateEvaluation(...args))

module.exports = router
