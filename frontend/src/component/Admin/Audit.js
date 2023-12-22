import React, { useState, useEffect, Fragment } from "react";

import { useSelector, useDispatch } from "react-redux";

import { getAuditLog } from "../../actions/userAction";
import Sidebar from "./Sidebar";

const AuditLog = () => {
  const dispatch = useDispatch();

  const { audit } = useSelector((state) => state.allAudit);
  console.log(audit);

  useEffect(() => {
    dispatch(getAuditLog());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="dashboard">
        <Sidebar />
        <div>
        <ul>
            {audit.map((log) => ( // Change forEach to map
              <li key={log._id}>
                <strong>Action:</strong> {log.action} | <strong>User:</strong>{" "}
                {log.user ? log.user.name : "Unknown"} |{" "}
                <strong>Timestamp:</strong>{" "}
                {new Date(log.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export default AuditLog;
