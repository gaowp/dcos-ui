import classNames from 'classnames/dedupe';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React from 'react';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import GeminiUtil from '../utils/GeminiUtil';
import InternalStorageMixin from '../mixins/InternalStorageMixin';
import NewPageHeader from '../components/NewPageHeader';
import SidebarToggle from '../components/SidebarToggle';
import TemplateUtil from '../utils/TemplateUtil';

const PageHeader = ({actions, addButton, breadcrumbs, tabs}) => {
  return (
    <NewPageHeader
      actions={actions}
      addButton={addButton}
      breadcrumbs={breadcrumbs}
      tabs={tabs} />
  );
};

TemplateUtil.defineChildren(PageHeader, {
  Breadcrumbs: NewPageHeader.Breadcrumbs,
  Actions: NewPageHeader.Actions,
  Tabs: NewPageHeader.Actions
});

PageHeader.defaultProps = {
  actions: [],
  tabs: []
};

PageHeader.propTypes = {
  actions: React.PropTypes.array,
  addButton: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object
  ]),
  breadcrumbs: React.PropTypes.node,
  tabs: React.PropTypes.array
};

var Page = React.createClass({

  displayName: 'Page',

  mixins: [InternalStorageMixin, StoreMixin],

  propTypes: {
    className: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object,
      React.PropTypes.string
    ]),
    dontScroll: React.PropTypes.bool,
    navigation: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.string
    ]),
    title: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.string
    ])
  },

  componentWillMount() {
    this.store_listeners = [
      {
        name: 'sidebar',
        events: ['widthChange']
      }
    ];
  },

  componentDidMount() {
    this.internalStorage_set({
      rendered: true
    });
    this.forceUpdate();
  },

  onSidebarStoreWidthChange() {
    GeminiUtil.updateWithRef(this.refs.gemini);
  },

  getChildren() {
    var data = this.internalStorage_get();
    if (data.rendered === true) {
      // Avoid rendering template children twice
      return TemplateUtil.filterTemplateChildren(
        this.constructor, this.props.children
      );
    }
    return null;
  },

  getNavigation(navigation) {
    if (!navigation) {
      return null;
    }

    return (
      <div className="page-header-navigation">
        {navigation}
      </div>
    );
  },

  getPageHeader() {
    return TemplateUtil.getChildOfType(
      this.props.children, this.constructor.Header
    );
  },

  getTitle(title) {
    if (!title) {
      return null;
    }

    if (React.isValidElement(title)) {
      return title;
    }

    return (
      <div className="page-header-title-container">
        <SidebarToggle />
        <h1 className="page-header-title flush">
          {title}
        </h1>
      </div>
    );
  },

  getContent() {
    let {dontScroll} = this.props;
    let contentClassSet = classNames('page-body-content pod flex',
      'flex-direction-top-to-bottom flex-item-grow-1', {
        'flex-item-shrink-1': dontScroll
      });

    let content = (
      <div className={contentClassSet}>
        {this.getChildren()}
      </div>
    );

    if (dontScroll) {
      return content;
    }

    return (
      <GeminiScrollbar
        autoshow={true}
        className="page-body flex flex-direction-top-to-bottom
          flex-direction-left-to-right-screen-large flex-item-grow-1
          flex-item-shrink-1 gm-scrollbar-container-flex"
        ref="gemini">
        {content}
      </GeminiScrollbar>
    );
  },

  render() {
    let {className, navigation, dontScroll, title} = this.props;

    let classSet = classNames(
      'page flex flex-direction-top-to-bottom flex-item-grow-1',
      {'flex-grow flex-shrink': dontScroll},
      className
    );

    return (
      <div className={classSet}>
        {this.getPageHeader(title, navigation)}
        {this.getContent()}
      </div>
    );
  }
});

TemplateUtil.defineChildren(Page, {Header: PageHeader});

module.exports = Page;
