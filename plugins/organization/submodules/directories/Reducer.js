import _ from 'underscore';

import {ACL_DIRECTORIES_CHANGED} from './constants/EventTypes';

let SDK = require('../../SDK').getSDK();

const initialState = {list: []};

module.exports = function (state = initialState, action) {
  if (action.__origin !== SDK.pluginID) {
    return state;
  }

  switch (action.type) {
    case ACL_DIRECTORIES_CHANGED:
      return _.extend({}, state, {list: action.directories});
    default:
      return state;
  }
};
