var overrides = require("./overrides");
overrides.override();

var Actions = require("./actions/Actions");
Actions.initialize();

Actions.log({eventID: "Stint started.", date: Actions.createdAt});
global.addEventListener("beforeunload", function () {
  Actions.log({eventID: "Stint ended."});
});

var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var Redirect = Router.Redirect;
var NotFoundRoute = Router.NotFoundRoute;

require("./utils/MomentJSConfig");
require("./utils/ReactSVG");
var Config = require("./config/Config");
var DashboardPage = require("./pages/DashboardPage");
import GroupsTab from "./pages/settings/GroupsTab";
var HostTable = require("./components/HostTable");
var Index = require("./pages/Index");
var NodesPage = require("./pages/NodesPage");
var NodesGridView = require("./components/NodesGridView");
var NotFoundPage = require("./pages/NotFoundPage");
import OrganizationPage from "./pages/settings/OrganizationPage";
import OverviewTab from "./pages/settings/OverviewTab";
var ServiceOverlay = require("./components/ServiceOverlay");
var ServicesPage = require("./pages/ServicesPage");
var SettingsPage = require("./pages/SettingsPage");
import SystemPage from "./pages/settings/SystemPage";
import UsersTab from "./pages/settings/UsersTab";

var routes = (
  <Route name="home" path="/" handler={Index}>
    <Route name="dashboard" path="dashboard/?" handler={DashboardPage}>
      <Route name="dashboard-panel" path="service-detail/:serviceName" />
      <Route name="dashboard-task-panel" path="task-detail/:taskID" />
    </Route>

    <Route name="services" path="services/?" handler={ServicesPage}>
      <Route name="service-ui" path="ui/:serviceName" handler={ServiceOverlay} />
      <Route name="services-panel" path="service-detail/:serviceName" />
      <Route name="services-task-panel" path="task-detail/:taskID" />
    </Route>

    <Route name="nodes" path="nodes/?" handler={NodesPage}>
      <Route name="nodes-list" path="list/?" handler={HostTable}>
        <Route name="nodes-list-panel" path="node-detail/:nodeID" />
        <Route name="nodes-list-task-panel" path="task-detail/:taskID" />
      </Route>

      <Route name="nodes-grid" path="grid/?" handler={NodesGridView}>
        <Route name="nodes-grid-panel" path="node-detail/:nodeID" />
        <Route name="nodes-grid-task-panel" path="task-detail/:taskID" />
      </Route>

      <Redirect from="/nodes/?" to="nodes-list" />
    </Route>

    <Route name="settings" path="settings/?" handler={SettingsPage}>
      <Route name="settings-system" path="system/?" handler={SystemPage}>
        <Route name="settings-system-overview" path="overview/?" handler={OverviewTab} />

        <Redirect from="/settings/system/?" to="settings-system-overview" />
      </Route>
      <Route name="settings-organization" path="organization/?" handler={OrganizationPage}>
        <Route name="settings-organization-users" path="users/?" handler={UsersTab} />
        <Route name="settings-organization-groups" path="groups/?" handler={GroupsTab} />

        <Redirect from="/settings/organization/?" to="settings-organization-users" />
      </Route>

      <Redirect from="/settings/?" to="settings-organization" />
    </Route>

    <Redirect from="/" to="dashboard" />

    <NotFoundRoute handler={NotFoundPage}/>
  </Route>
);

Router.run(routes, function (Handler, state) {
  Config.setOverrides(state.query);
  React.render(<Handler state={state} />, document.getElementById("application"));
});
