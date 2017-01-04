import {Confirm} from 'reactjs-components';
import React, {PropTypes} from 'react';
import PureRender from 'react-addons-pure-render-mixin';

import AppLockedMessage from './AppLockedMessage';
import Framework from '../../structs/Framework';
import ModalHeading from '../../../../../../src/js/components/modals/ModalHeading';
import Pod from '../../structs/Pod';
import Service from '../../structs/Service';
import ServiceTree from '../../structs/ServiceTree';

class ServiceDestroyModal extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      errorMsg: null
    };

    this.shouldComponentUpdate = PureRender.shouldComponentUpdate.bind(this);
  }

  componentWillUpdate(nextProps) {
    const requestCompleted = this.props.isPending
      && !nextProps.isPending;

    const shouldClose = requestCompleted && !nextProps.errors;

    if (shouldClose) {
      this.props.onClose();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {errors} = nextProps;
    if (!errors) {
      this.setState({errorMsg: null});

      return;
    }

    if (typeof errors === 'string') {
      this.setState({errorMsg: errors});

      return;
    }

    let {message: errorMsg = '', details} = errors;
    const hasDetails = details && details.length !== 0;

    if (hasDetails) {
      errorMsg = details.reduce(function (memo, error) {
        return `${memo} ${error.errors.join(' ')}`;
      }, '');
    }

    if (!errorMsg || !errorMsg.length) {
      errorMsg = null;
    }

    this.setState({errorMsg});
  }

  shouldForceUpdate() {
    return this.state.errorMsg && /force=true/.test(this.state.errorMsg);
  }

  getDestroyMessage() {
    const {service} = this.props;
    let serviceName = '';

    if (service) {
      serviceName = service.getId();
    }

    if (service instanceof Framework) {
      return (
        <p>
          This will only destroy the package scheduler for <span className="emphasize">{serviceName}</span>. Any tasks that were started by this scheduler will persist in the system. Are you sure you want to continue?
        </p>
      );
    }

    return (
      <p>
        Destroying <span className="emphasize">{serviceName}</span> is irreversible. Are you sure you want to continue?
      </p>
    );
  }

  getErrorMessage() {
    const {errorMsg = null} = this.state;

    if (!errorMsg) {
      return null;
    }

    if (this.shouldForceUpdate()) {
      return (
        <AppLockedMessage service={this.props.service} />
      );
    }

    return (
      <h4 className="text-align-center text-danger flush-top">{errorMsg}</h4>
    );
  }

  render() {
    const {
      deleteItem,
      isPending,
      onClose,
      open,
      service
    } = this.props;

    let itemText = 'Service';

    if (service instanceof Pod) {
      itemText = 'Pod';
    }

    if (service instanceof ServiceTree) {
      itemText = 'Group';
    }

    let heading = (
      <ModalHeading className="text-danger">
        Destroy {itemText}
      </ModalHeading>
    );

    return (
      <Confirm
        disabled={isPending}
        header={heading}
        open={open}
        onClose={onClose}
        leftButtonText="Cancel"
        leftButtonCallback={onClose}
        rightButtonText={`Destroy ${itemText}`}
        rightButtonClassName="button button-danger"
        rightButtonCallback={() => deleteItem(this.shouldForceUpdate())}
        showHeader={true}>
        {this.getDestroyMessage()}
        {this.getErrorMessage()}
      </Confirm>
    );
  }
}

ServiceDestroyModal.propTypes = {
  deleteItem: PropTypes.func.isRequired,
  errors: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  isPending: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  service: PropTypes.oneOfType([
    PropTypes.instanceOf(ServiceTree),
    PropTypes.instanceOf(Service)
  ]).isRequired
};

module.exports = ServiceDestroyModal;