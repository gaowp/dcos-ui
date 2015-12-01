let ActionTypes = {};
[
  "INTERCOM_ACTION",
  "REQUEST_ACL_SUCCESS",
  "REQUEST_ACL_ERROR",
  "REQUEST_ACL_GRANT_USER_ACTION_SUCCESS",
  "REQUEST_ACL_GRANT_USER_ACTION_ERROR",
  "REQUEST_ACL_REVOKE_USER_ACTION_SUCCESS",
  "REQUEST_ACL_REVOKE_USER_ACTION_ERROR",
  "REQUEST_ACL_GRANT_GROUP_ACTION_SUCCESS",
  "REQUEST_ACL_GRANT_GROUP_ACTION_ERROR",
  "REQUEST_ACL_REVOKE_GROUP_ACTION_SUCCESS",
  "REQUEST_ACL_REVOKE_GROUP_ACTION_ERROR",
  "REQUEST_ACL_GROUP_ADD_USER_SUCCESS",
  "REQUEST_ACL_GROUP_ADD_USER_ERROR",
  "REQUEST_ACL_GROUP_DETAILS_SUCCESS",
  "REQUEST_ACL_GROUP_DETAILS_ERROR",
  "REQUEST_ACL_GROUP_SUCCESS",
  "REQUEST_ACL_GROUP_ERROR",
  "REQUEST_ACL_GROUP_PERMISSIONS_SUCCESS",
  "REQUEST_ACL_GROUP_PERMISSIONS_ERROR",
  "REQUEST_ACL_GROUP_REMOVE_USER_SUCCESS",
  "REQUEST_ACL_GROUP_REMOVE_USER_ERROR",
  "REQUEST_ACL_GROUP_USERS_SUCCESS",
  "REQUEST_ACL_GROUP_USERS_ERROR",
  "REQUEST_ACL_GROUP_CREATE_SUCCESS",
  "REQUEST_ACL_GROUP_CREATE_ERROR",
  "REQUEST_ACL_GROUP_UPDATE_SUCCESS",
  "REQUEST_ACL_GROUP_UPDATE_ERROR",
  "REQUEST_ACL_GROUP_DELETE_SUCCESS",
  "REQUEST_ACL_GROUP_DELETE_ERROR",
  "REQUEST_ACL_GROUPS_SUCCESS",
  "REQUEST_ACL_GROUPS_ERROR",
  "REQUEST_ACL_USER_CREATE_SUCCESS",
  "REQUEST_ACL_USER_CREATE_ERROR",
  "REQUEST_ACL_USER_UPDATE_SUCCESS",
  "REQUEST_ACL_USER_UPDATE_ERROR",
  "REQUEST_ACL_USER_DELETE_SUCCESS",
  "REQUEST_ACL_USER_DELETE_ERROR",
  "REQUEST_ACL_USER_SUCCESS",
  "REQUEST_ACL_USER_ERROR",
  "REQUEST_ACL_USER_GROUPS_SUCCESS",
  "REQUEST_ACL_USER_GROUPS_ERROR",
  "REQUEST_ACL_USER_PERMISSIONS_SUCCESS",
  "REQUEST_ACL_USER_PERMISSIONS_ERROR",
  "REQUEST_ACL_USERS_SUCCESS",
  "REQUEST_ACL_USERS_ERROR",
  "REQUEST_CLI_INSTRUCTIONS",
  "REQUEST_CONFIG_SUCCESS",
  "REQUEST_CONFIG_ERROR",
  "REQUEST_DCOS_METADATA",
  "REQUEST_INTERCOM_CLOSE",
  "REQUEST_INTERCOM_OPEN",
  "REQUEST_MARATHON_APPS",
  "REQUEST_MARATHON_APPS_SUCCESS",
  "REQUEST_MARATHON_APPS_ERROR",
  "REQUEST_MARATHON_APPS_ONGOING",
  "REQUEST_MESOS_SUMMARY_SUCCESS",
  "REQUEST_MESOS_SUMMARY_ERROR",
  "REQUEST_MESOS_SUMMARY_ONGOING",
  "REQUEST_MESOS_STATE_SUCCESS",
  "REQUEST_MESOS_STATE_ERROR",
  "REQUEST_MESOS_STATE_ONGOING",
  "REQUEST_MESOS_HISTORY_SUCCESS",
  "REQUEST_MESOS_HISTORY_ERROR",
  "REQUEST_METADATA",
  "REQUEST_SIDEBAR_CLOSE",
  "REQUEST_SIDEBAR_OPEN",
  "REQUEST_TASK_DIRECTORY_SUCCESS",
  "REQUEST_TASK_DIRECTORY_ERROR",
  "REQUEST_TOUR_START",
  "REQUEST_VERSIONS_SUCCESS",
  "REQUEST_VERSIONS_ERROR",
  "SERVER_ACTION",
  "SIDEBAR_ACTION"
].forEach(function (actionType) {
  ActionTypes[actionType] = actionType;
});

export default ActionTypes;
