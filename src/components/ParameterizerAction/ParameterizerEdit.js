import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import * as tokenHolderActions from '../../actions/TokenHolderActions';
import './style.css';
import keys from '../../i18n';

class ParameterizerEdit extends Component {
	constructor (props) {
		super();
	
		this.handleValueChange = this.handleValueChange.bind(this);
	
		this.state = {
		  newValue: '',
		  error: ''
		};
	}

	componentWillReceiveProps (newProps) {
		if (newProps !== this.props) {
			this.setState({ newValue: '', error: '' })
		}
	}

	handleValueChange (value) {
		const re = /^\d+$/;

		if (re.test(value) && value !== '') {
			this.setState({ newValue: value, error: '' })
		} else {
			this.setState({ newValue: value, error: keys.invalidInput })
		}
	}

	render () {
		const { activeProposal, tokenHolderActions } = this.props;

		return (
			<div className='parameterizerAction'>
				<div>
					<h3 className='parameterName'>{activeProposal.name}</h3>
					<p>{keys.currentValueText}: {activeProposal.value}</p>
					<TextField
						hintText={keys.hintText}
						errorText={this.state.error}
						floatingLabelText={keys.proposalValueText}
						floatingLabelFixed
						style={{ marginBottom: 30 }}
						onChange={e => this.handleValueChange(e.target.value)}
						value={this.state.newValue}
					/>
					<RaisedButton
						label={keys.proposeValueChange}
						backgroundColor={keys.successColor}
						labelColor={keys.buttonLabelColor}
						onClick={() => tokenHolderActions.proposeNewValue(activeProposal, this.state.newValue)}
						disabled={!this.state.newValue || !!this.state.error}
					/>
				</div>
			</div>
		)
	}
}

ParameterizerEdit.propTypes = {
	activeProposal: PropTypes.object.isRequired,
	tokenHolderActions: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	// showTxQueue: state.reveal.showTxQueue,
	// txQueue: state.reveal.queue
});
  
const mapDispatchToProps = (dispatch) => ({
	tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});
  
export default connect(mapStateToProps, mapDispatchToProps)(ParameterizerEdit);
