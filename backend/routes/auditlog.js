const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();
const {
  getAuditLog
  } = require("../controllers/auditController");

  router.route("/admin/auditlog").get( isAuthenticatedUser, authorizeRoles("admin"), getAuditLog);
  module.exports = router;