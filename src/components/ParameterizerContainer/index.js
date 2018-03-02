import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../../actions/AppActions';
import ParameterizerList from '../ParameterizerList';
import ParameterizerAction from '../ParameterizerAction';
import './style.css';
import keys from '../../i18n';
import UrlUtils from '../../utils/UrlUtils';

class ParameterizerContainer extends Component {
  constructor (props) {
    super();

    this.selectParameter = this.selectParameter.bind(this);

    this.state = {
      activeProposal: null
    };
  }

  componentWillMount () {
    const registry = UrlUtils.getRegistryAddressByLink();
    if (registry && registry !== this.props.registry) {
      this.props.appActions.changeRegistry(registry);
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.parameterizer.parameters !== this.props.parameterizer.parameters) {
      this.setState({ activeProposal: null });
    }
  }

  selectParameter (parameter) {
    this.setState({
      activeProposal: parameter
    });
  }

  render () {
    return (
      <div className='ContentContainer'>
        <h4 className='pageHeadline'>{keys.parameterizationPage}</h4>
        <h3 className='manageTokensTitle'>
          {keys.parameterizationTitle}
        </h3>
        <div className='ParameterizerContainer'>
          <ParameterizerList
            parameterizer={this.props.parameterizer}
            activeProposal={this.state.activeProposal}
            selectParameter={this.selectParameter}
          />
          <ParameterizerAction
            activeProposal={this.state.activeProposal}
          />
        </div>
      </div>
    );
  }
}

ParameterizerContainer.propTypes = {
  parameterizer: PropTypes.object.isRequired,
  appActions: PropTypes.object.isRequired,
  registry: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  parameterizer: state.parameterizer,
  registry: state.app.registry
});

function mapDispatchToProps (dispatch) {
  return {
    appActions: bindActionCreators(appActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ParameterizerContainer);
