import ActionTypes from '../constants/ActionTypes';
import Config from '../config/Config';
import RequestUtil from '../utils/RequestUtil';

var AppDispatcher = require('./AppDispatcher');

module.exports = {

  open: function () {
    AppDispatcher.handleSidebarAction({
      type: ActionTypes.REQUEST_SIDEBAR_OPEN,
      data: true
    });
  },

  close: function () {
    AppDispatcher.handleSidebarAction({
      type: ActionTypes.REQUEST_SIDEBAR_CLOSE,
      data: false
    });
  },

  openCliInstructions: function () {
    AppDispatcher.handleSidebarAction({
      type: ActionTypes.REQUEST_CLI_INSTRUCTIONS,
      data: false
    });
  },

  showVersions: function () {
    var host = Config.rootUrl.replace(/:[0-9]{0,4}$/, '');
    var url = host + '/pkgpanda/active.buildinfo.full.json';

    RequestUtil.json({
      url: url,
      success: function (response) {
        AppDispatcher.handleSidebarAction({
          type: ActionTypes.REQUEST_VERSIONS_SUCCESS,
          data: response
        });
      },
      error: function (e) {
        AppDispatcher.handleSidebarAction({
          type: ActionTypes.REQUEST_VERSIONS_ERROR,
          data: e.message
        });
      }
    });
  },

  triggerPageUpdate: function () {
    AppDispatcher.handleSidebarAction({
      type: ActionTypes.TRIGGER_PAGE_UPDATE
    });
  }
};
