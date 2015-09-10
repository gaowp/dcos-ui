jest.dontMock("../../stores/MarathonStore");
jest.dontMock("../../utils/StringUtil");
jest.dontMock("../../utils/MesosSummaryUtil");
jest.dontMock("../../utils/Store");

let MarathonStore = require("../../stores/MarathonStore");
let Service = require("../Service");
let ServicesList = require("../ServicesList");

describe("ServicesList", function () {

  describe("#constructor", function () {

    it("creates instances of Service", function () {
      let items = [{foo: "bar"}];
      let list = new ServicesList({items});
      items = list.getItems();
      expect(items[0] instanceof Service).toBeTruthy();
    });

  });

  describe("#filter", function () {

    it("returns unfiltered list", function () {
      let items = [{a: 1}, {b: 2}];
      let list = new ServicesList({items});
      expect(list.filter().getItems().length).toEqual(2);
    });

    it("filters by ids", function () {
      let items = [
        {id: 1, name: "marathon"},
        {id: 2, name: "chronos"},
        {id: "3", name: "marathon-user"}
      ];
      let list = new ServicesList({items});
      let filteredList = list.filter({ids: [2, "3"]}).getItems();
      expect(filteredList.length).toEqual(2);
      expect(filteredList[0].get("name")).toEqual("chronos");
      expect(filteredList[1].get("name")).toEqual("marathon-user");
    });

    it("filters by name", function () {
      let items = [
        {name: "marathon"},
        {name: "chronos"},
        {name: "marathon-user"}
      ];
      let list = new ServicesList({items});
      let filteredList = list.filter({name: "marath"}).getItems();
      expect(filteredList.length).toEqual(2);
      expect(filteredList[0].get("name")).toEqual("marathon");
      expect(filteredList[1].get("name")).toEqual("marathon-user");
    });

    it("filters by health", function () {
      var oldFunction = MarathonStore.getServiceHealth;
      MarathonStore.getServiceHealth = function (name) {
        switch (name) {
          case "marathon":
          case "marathon-user":
            return {value: 1};
          default:
            return {value: 0};
        }
      };

      let items = [
        {name: "marathon"},
        {name: "chronos"},
        {name: "marathon-user"}
      ];
      let list = new ServicesList({items});
      let filteredList = list.filter({health: 0}).getItems();
      expect(filteredList.length).toEqual(1);
      expect(filteredList[0].get("name")).toEqual("chronos");

      // Reset
      MarathonStore.getServiceHealth = oldFunction;
    });

  });

  describe("#sumUsedResources", function () {

    it("returns all resources as 0 when there's no services", function () {
      let list = new ServicesList();
      expect(list.sumUsedResources()).toEqual({cpus: 0, mem: 0, disk: 0});
    });

    it("returns used resources when there's one service", function () {
      let list = new ServicesList({items: [
        {used_resources: {cpus: 1, mem: 3, disk: 1}}
      ]});
      expect(list.sumUsedResources()).toEqual({cpus: 1, mem: 3, disk: 1});
    });

    it("sums used resources for services", function () {
      let list = new ServicesList({items: [
        {used_resources: {cpus: 1, mem: 3, disk: 1}},
        {used_resources: {cpus: 1, mem: 3, disk: 1}}
      ]});
      expect(list.sumUsedResources()).toEqual({cpus: 2, mem: 6, disk: 2});
    });

  });

  describe("#sumTaskStates", function () {

    it("returns an empty hash when there's no services", function () {
      let list = new ServicesList();
      let expectedList = {
        TASK_STAGING: 0,
        TASK_STARTING: 0,
        TASK_RUNNING: 0,
        TASK_FINISHED: 0,
        TASK_FAILED: 0,
        TASK_LOST: 0,
        TASK_ERROR: 0
      };
      expect(list.sumTaskStates()).toEqual(expectedList);
    });

    it("sums tasks for one service", function () {
      let list = new ServicesList({items: [
        {TASK_STAGING: 2, TASK_STARTING: 10, TASK_LOST: 5}
      ]});
      let expectedList = {
        TASK_STAGING: 2,
        TASK_STARTING: 10,
        TASK_RUNNING: 0,
        TASK_FINISHED: 0,
        TASK_FAILED: 0,
        TASK_LOST: 5,
        TASK_ERROR: 0
      };
      expect(list.sumTaskStates()).toEqual(expectedList);
    });

    it("sums tasks for many services", function () {
      let list = new ServicesList({items: [
        {TASK_STAGING: 2, TASK_STARTING: 10, TASK_LOST: 5},
        {TASK_STAGING: 2, TASK_STARTING: 5, TASK_FAILED: 3}
      ]});
      let expectedList = {
        TASK_STAGING: 4,
        TASK_STARTING: 15,
        TASK_RUNNING: 0,
        TASK_FINISHED: 0,
        TASK_FAILED: 3,
        TASK_LOST: 5,
        TASK_ERROR: 0
      };
      expect(list.sumTaskStates()).toEqual(expectedList);
    });

  });

});
