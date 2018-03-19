import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../../actions/AppActions';
import * as tokenHolderActions from '../../actions/TokenHolderActions';
import ParameterizerList from '../ParameterizerList';
import ParameterizerAction from '../ParameterizerAction';
import './style.css';
import keys from '../../i18n';
import UrlUtils from '../../utils/UrlUtils';

class ParameterizerContainer extends Component {
  constructor (props) {
    super();

    this.selectParameter = this.selectParameter.bind(this);
    this.selectParametrizerParameter = this.selectParametrizerParameter.bind(this);

    this.state = {
      activeProposal: null,
      activeParametrizerProposal: null
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
      this.setState({ activeProposal: null, activeParametrizerProposal: null });
    }
  }

  selectParameter (parameter) {
    this.props.tokenHolderActions.hideParameterizerTxQueue();
    this.setState({ activeProposal: parameter });
  }

  selectParametrizerParameter (parameter) {
    this.props.tokenHolderActions.hideParameterizerTxQueue();
    this.setState({ activeParametrizerProposal: parameter });
  }

  render () {
    const {parameterizer} = this.props;
    return (
      <div className='ContentContainer'>
        <h4 className='pageHeadline'>{keys.parameterizationPage}</h4>
        <h3 className='manageTokensTitle'>
          {keys.parameterizationTitle}
        </h3>
        <div className='ParameterizerContainer'>
          <ParameterizerList
            parameters={parameterizer.parameters}
            isFetching={parameterizer.isFetching}
            activeProposal={this.state.activeProposal}
            selectParameter={this.selectParameter}
          />
          <ParameterizerAction
            activeProposal={this.state.activeProposal}
          />
        </div>
        <h3 className='manageTokensTitle'>
          {keys.pParameterizationTitle}
        </h3>
        <div className='ParameterizerContainer'>
          <ParameterizerList
            parameters={parameterizer.pParameters}
            isFetching={parameterizer.isFetching}
            activeProposal={this.state.activeParametrizerProposal}
            selectParameter={this.selectParametrizerParameter}
          />
          <ParameterizerAction
            activeProposal={this.state.activeParametrizerProposal}
          />
        </div>
      </div>
    );
  }
}

ParameterizerContainer.propTypes = {
  parameterizer: PropTypes.object.isRequired,
  appActions: PropTypes.object.isRequired,
  tokenHolderActions: PropTypes.object.isRequired,
  registry: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  parameterizer: state.parameterizer,
  registry: state.app.registry
});

function mapDispatchToProps (dispatch) {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ParameterizerContainer);
