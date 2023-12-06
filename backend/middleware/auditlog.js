const AuditLog = require('../models/auditlog');

const createAuditLog = async (userId, action) => {
  try {
    await AuditLog.create({ user: userId, action });
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
};

module.exports = createAuditLog;
