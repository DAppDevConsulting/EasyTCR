import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import ParameterizerList from '../ParameterizerList';
import ParameterizerAction from '../ParameterizerAction';
import './style.css';
import keys from '../../i18n';

class ParameterizerContainer extends Component {
  constructor (props) {
    super();

    this.selectParameter = this.selectParameter.bind(this);

    this.state = {
      activeProposal: null
    };
  }

  selectParameter (parameter) {
    this.setState({
      activeProposal: parameter
    })
  }

  render () {
      return (
        <div className='ContentContainer'>
          <h4 className='pageHeadline'>{keys.parameterizationPage}</h4>
          <h3 className='manageTokensTitle'>{keys.parameterizationTitle}</h3>
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
};

const mapStateToProps = state => ({
  parameterizer: state.parameterizer
});

export default connect(mapStateToProps)(ParameterizerContainer);
