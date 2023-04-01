const OEMController = require("../controllers/OEMController")
const router = require("express").Router()

router.patch("/:oem_id", OEMController.updateOEM)
router.delete("/:oem_id", OEMController.deleteOEM)

module.exports = router