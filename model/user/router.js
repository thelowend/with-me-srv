const controller = require('./controller')
const Router = require('express').Router
const router = new Router()

router.route('/')
  .get((...args) => controller.find(...args))
  .post((...args) => controller.create(...args))

router.route('/helper')
  .get((...args) => controller.findHelpers(...args))
  
router.route('/:id/approve')
  .put((...args) => controller.approveHelper(...args))
  .delete((...args) => controller.disapproveHelper(...args))

router.route('/:id')
  .put((...args) => controller.updateOne(...args))
  .patch((...args) => controller.update(...args))
  .get((...args) => controller.findById(...args))
  .delete((...args) => controller.remove(...args))

router.route('/:id/evaluation/:category')
  .put((...args) => controller.updateEvaluation(...args))

router.route('/:id/social/:target')
  .post((...args) => controller.postStatus(...args))

router.route('/:id/social/generatefeed/:num/:sad')
  .put((...args) => controller.generateFeed(...args)) // For testing purposes

router.route('/:id/metadata')
  .get((...args) => controller.getMetaData(...args))

router.route('/:id/contact')
  .get((...args) => controller.getContactInfo(...args))
  .delete((...args) => controller.deleteContacts(...args))

router.route('/:id/contact/:contactid')
  .post((...args) => controller.addContact(...args)) // Helper adds a contact
  .delete((...args) => controller.removeContact(...args)) // Helper removes contact

router.route('/:id/messages')
  .get((...args) => controller.getUserMessages(...args))

router.route('/:id/history')
  .delete((...args) => controller.clearHistory(...args))

router.route('/:id/feed')
  .get((...args) => controller.getUserWithFeed(...args))
  .delete((...args) => controller.clearFeed(...args))

module.exports = router
