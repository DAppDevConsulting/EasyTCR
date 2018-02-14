import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LinearProgress from 'material-ui/LinearProgress';
import ParameterizerList from '../ParameterizerList';
import ParameterizerAction from '../ParameterizerAction';
import './style.css';
import keys from '../../i18n';

class ParameterizerContainer extends Component {
  constructor (props) {
    super();
  }

  render () {
      return (
        <div className='ContentContainer'>
          <h4 className='pageHeadline'>{keys.parameterizationPage}</h4>
          <h3 className='manageTokensTitle'>{keys.parameterizationTitle}</h3>
          <div className='ParameterizerContainer'>
            <ParameterizerList
              parameterizer={this.props.parameterizer}
            />
            <ParameterizerAction
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

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ParameterizerContainer);
