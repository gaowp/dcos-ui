var React = require('react');
import ReactDOM from 'react-dom';

var DOMUtils = require('../../utils/DOMUtils');
import EventTypes from '../../constants/EventTypes';
var InternalStorageMixin = require('../../mixins/InternalStorageMixin');
import SidebarStore from '../../stores/SidebarStore';

var Chart = React.createClass({

  displayName: 'Chart',

  mixins: [InternalStorageMixin],

  propTypes: {
    calcHeight: React.PropTypes.func,
    delayRender: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      calcHeight: null,
      delayRender: false
    };
  },

  componentWillMount: function () {
    this.internalStorage_set({width: null});
  },

  componentDidMount: function () {
    if (this.props.delayRender) {
      // As of right now this is used on the Side Panels
      // because they animate in we need to wait on calling
      // `window.getComputedStyle` because it'll cause a repaint
      // which causes the panel to not animate
      // Making this happen on the next tick fixes it.
      setTimeout(this.updateWidth, 0);
    } else {
      this.updateWidth();
    }
    window.addEventListener('resize', this.updateWidth);
    SidebarStore.addChangeListener(EventTypes.PAGE_UPDATE, this.updateWidth);
  },

  shouldComponentUpdate: function () {
    return DOMUtils.isElementOnTop(ReactDOM.findDOMNode(this));
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.updateWidth);
    SidebarStore.removeChangeListener(EventTypes.PAGE_UPDATE, this.updateWidth);
  },

  updateWidth: function () {
    if (!this.isMounted()) {
      return;
    }
    var node = ReactDOM.findDOMNode(this);
    var dimensions = DOMUtils.getComputedDimensions(node);
    var data = this.internalStorage_get();

    if (data.width !== dimensions.width || data.height !== dimensions.height) {
      this.internalStorage_set(dimensions);
      this.forceUpdate();
    }
  },

  getChildren: function () {
    var data = this.internalStorage_get();
    var width = data.width;
    var height = data.height;
    if (width != null) {
      var calcHeight = this.props.calcHeight;

      if (typeof calcHeight === 'function') {
        height = calcHeight(width);
      }

      var children = this.props.children;
      if (Array.isArray(children)) {
        height = height / children.length;
        return children.map(function (child) {
          return React.cloneElement(
            child,
            {width: width, height: height}
          );
        });
      } else {
        return React.cloneElement(
          children,
          {width: width, height: height}
        );
      }
    }
  },

  render: function () {
    // at the moment, 'chart' is used to inject the chart colour palette.
    // we should reclaim it as the rightful className of <Chart />
    return (
      <div className="chart-chart">
        {this.getChildren()}
      </div>
    );
  }
});

module.exports = Chart;
