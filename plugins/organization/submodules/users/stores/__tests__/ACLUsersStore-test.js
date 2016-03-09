jest.dontMock('../ACLUsersStore');
jest.dontMock('../../actions/ACLUsersActions');
jest.dontMock('../../structs/User');
jest.dontMock('../../structs/UsersList');
jest.dontMock('../../../../../../tests/_fixtures/acl/users-unicode.json');

import PluginTestUtils from 'PluginTestUtils';

PluginTestUtils.dontMock(['List', 'Item']);

let SDK = PluginTestUtils.getSDK('organization', {enabled: true});
require('../../../../SDK').setSDK(SDK);

var _ = require('underscore');
var ACLUsersStore = require('../ACLUsersStore');
var ActionTypes = require('../../constants/ActionTypes');
var EventTypes = require('../../constants/EventTypes');
var UsersList = require('../../structs/UsersList');
var {RequestUtil, Config} = SDK.get(['RequestUtil', 'Config']);
var OrganizationReducer = require('../../../../Reducer');

PluginTestUtils.addReducer('organization', OrganizationReducer);

var usersFixture = require('../../../../../../tests/_fixtures/acl/users-unicode.json');

describe('ACLUsersStore', function () {

  beforeEach(function () {
    this.requestFn = RequestUtil.json;
    RequestUtil.json = function (handlers) {
      handlers.success(usersFixture);
    };
    this.usersFixture = _.clone(usersFixture);
  });

  afterEach(function () {
    RequestUtil.json = this.requestFn;
  });

  it('should return an instance of UsersList', function () {
    Config.useFixtures = true;
    ACLUsersStore.fetchUsers();
    var users = ACLUsersStore.getUsers();
    expect(users instanceof UsersList).toBeTruthy();
  });

  it('should return all of the users it was given', function () {
    Config.useFixtures = true;
    ACLUsersStore.fetchUsers();
    var users = ACLUsersStore.getUsers().getItems();
    expect(users.length).toEqual(this.usersFixture.array.length);
  });

  describe('dispatcher', function () {

    it('stores users when event is dispatched', function () {
      SDK.dispatch({
        type: ActionTypes.REQUEST_ACL_USERS_SUCCESS,
        data: [{gid: 'foo', bar: 'baz'}]
      });

      var users = ACLUsersStore.getUsers().getItems();
      expect(users[0].gid).toEqual('foo');
      expect(users[0].bar).toEqual('baz');
    });

    it('dispatches the correct event upon success', function () {
      var mockedFn = jest.genMockFunction();
      ACLUsersStore.addChangeListener(EventTypes.ACL_USERS_CHANGE, mockedFn);
      SDK.dispatch({
        type: ActionTypes.REQUEST_ACL_USERS_SUCCESS,
        data: [{gid: 'foo', bar: 'baz'}]
      });

      expect(mockedFn.mock.calls.length).toEqual(1);
    });

    it('dispatches the correct event upon error', function () {
      var mockedFn = jasmine.createSpy();
      ACLUsersStore.addChangeListener(
        EventTypes.ACL_USERS_REQUEST_ERROR,
        mockedFn
      );
      SDK.dispatch({
        type: ActionTypes.REQUEST_ACL_USERS_ERROR,
        data: 'foo'
      });

      expect(mockedFn.calls.length).toEqual(1);
      expect(mockedFn.calls[0].args).toEqual(['foo']);
    });

  });

});
