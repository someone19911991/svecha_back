const router = require('express').Router()
const ReferenceController = require('../controllers/ReferenceController')

router.patch("/:ref_id", ReferenceController.updateReference)
router.delete("/:ref_id", ReferenceController.deleteReference)

module.exports = router