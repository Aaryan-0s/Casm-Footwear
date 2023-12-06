const AuditLog = require("../models/auditlog");
const catchAsyncError = require("../middleware/catchAsyncError");
exports.getAuditLog = catchAsyncError(async (req, res, next) => {
  const auditLog = await AuditLog.find().populate("user");

  res.status(200).json({
    success: true,
    auditLog,
  });
});

