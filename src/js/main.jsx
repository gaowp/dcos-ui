/** @jsx React.DOM */

var React = require("react");
var Router = require("react-router");
var Route = Router.Route;

require("./utils/ReactSVG");
var ActivityPage = require("./components/ActivityPage");
var DatacenterPage = require("./components/DatacenterPage");
var Index = require("./components/Index");
var ServicesPage = require("./components/ServicesPage");

/* jshint trailing:false, quotmark:false, newcap:false */
/* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
var routes = (
  <Route name="home" path="/" handler={Index}>
    <Route name="activity" path="activity/" handler={ActivityPage} />
    <Route name="services" path="services/" handler={ServicesPage} />
    <Route name="datacenter" path="datacenter/" handler={DatacenterPage} />
  </Route>
);

Router.run(routes, function (Handler, state) {
  React.render(<Handler state={state} />, document.body);
});
