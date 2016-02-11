import cookie from 'cookie';
import {Store} from 'mesosphere-shared-reactjs';

import ACLAuthActions from '../events/ACLAuthActions';
import ActionTypes from '../constants/ActionTypes';
import ACLAuthConstants from '../constants/ACLAuthConstants';
import ACLUserRoles from '../constants/ACLUserRoles';
import AppDispatcher from '../events/AppDispatcher';
import EventTypes from '../constants/EventTypes';
import GetSetMixin from '../mixins/GetSetMixin';
import Plugins from '../plugins/Plugins';

function getUserMetadata() {
  return cookie.parse(global.document.cookie)[ACLAuthConstants.userCookieKey];
}

var ACLAuthStore = Store.createStore({
  storeID: 'auth',

  mixins: [GetSetMixin],

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  login: ACLAuthActions.login,

  logout: ACLAuthActions.logout,

  fetchRole: ACLAuthActions.fetchRole,

  isLoggedIn: function () {
    return !!getUserMetadata();
  },

  getUser: function () {
    let userCode = getUserMetadata();

    if (!userCode) {
      return null;
    }

    try {
      return JSON.parse(atob(userCode));
    } catch(err) {
      return null;
    }
  },

  isAdmin() {
    return this.get('role') === ACLUserRoles.admin;
  },

  makeAdminRole() {
    let role = this.get('role');
    if (role !== ACLUserRoles.admin) {
      this.set({role: ACLUserRoles.admin});
      this.emit(EventTypes.ACL_AUTH_USER_ROLE_CHANGED);
    }
  },

  makeDefaultRole() {
    let role = this.get('role');
    if (role !== ACLUserRoles.default) {
      this.set({role: ACLUserRoles.default});
      this.emit(EventTypes.ACL_AUTH_USER_ROLE_CHANGED);
    }
  },

  resetRole() {
    this.set({role: undefined});
  },

  processLoginSuccess() {
    // Reset role before fetching new one
    this.resetRole();

    let user = this.getUser();
    if (!user) {
      this.makeDefaultRole();
    }
    this.emit(EventTypes.ACL_AUTH_USER_LOGIN_CHANGED);
  },

  processLogoutSuccess: function () {
    // Set the cookie to an empty string.
    global.document.cookie = cookie.serialize(
      ACLAuthConstants.userCookieKey, '', {expires: new Date(1970)}
    );

    this.resetRole();
    this.emit(EventTypes.ACL_AUTH_USER_LOGOUT_SUCCESS);
    Plugins.doAction('userLogoutSuccess');
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_ACL_LOGIN_SUCCESS:
        ACLAuthStore.processLoginSuccess();
        break;
      case ActionTypes.REQUEST_ACL_LOGIN_ERROR:
        ACLAuthStore.emit(EventTypes.ACL_AUTH_USER_LOGIN_ERROR, action.data);
        break;
      case ActionTypes.REQUEST_ACL_LOGOUT_SUCCESS:
        ACLAuthStore.processLogoutSuccess();
        break;
      case ActionTypes.REQUEST_ACL_LOGOUT_ERROR:
        ACLAuthStore.emit(EventTypes.ACL_AUTH_USER_LOGOUT_ERROR, action.data);
        break;
      // Get role of current user
      case ActionTypes.REQUEST_ACL_ROLE_SUCCESS:
        ACLAuthStore.makeAdminRole();
        break;
      // Get role of current user
      case ActionTypes.REQUEST_ACL_ROLE_ERROR:
        ACLAuthStore.makeDefaultRole();
        break;
    }

    return true;
  })
});

module.exports = ACLAuthStore;
