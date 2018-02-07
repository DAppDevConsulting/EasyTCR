import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';

class Reveal extends Component {
	constructor (props) {
    super(props);

	this.handleVote = this.handleVote.bind(this);
	this.handleRadioSelect = this.handleRadioSelect.bind(this);

    this.state = {
	  vote: ''
    };
  }

  	handleVote () {
		console.log('handleVote')
	}

	handleRadioSelect (event, value) {
		this.setState({ vote: value })
	}
	
	render () {
		return (
			<div className='listingAction'>
				<h4 className='headline'>Voting - Reveal</h4>
				<div className='votingResults'>
					<div className='votingResultsItem'>
						<span className='votingResultLabel'>Support</span>
						<LinearProgress
							mode='determinate'
							color='#66bb6a'
							value={72}
						/>
						<span className='votingResultPercent'>{'72' + ' %'}</span>
					</div>
					<div className='votingResultsItem'>
						<span className='votingResultLabel'>Oppose</span>
						<LinearProgress
							mode='determinate'
							color='#d55853'
							value={28}
						/>
						<span className='votingResultPercent'>{'28' + ' %'}</span>
					</div>
				</div>
				<div className='actionData'>
					<p className='challengeId'>Challenge ID: {36}</p>
					<TextField
						floatingLabelText='Save Secret Phrase (salt)'
						floatingLabelFixed
					/>
					<div>
						<span className='groupLable'>Choose what you commited</span>
						<RadioButtonGroup
							name='voting'
							onChange={(event, value) => this.handleRadioSelect(event, value)}
						>
							<RadioButton
								value='support'
								label='Support'
							/>
							<RadioButton
								value='oppose'
								label='Oppose'
							/>
						</RadioButtonGroup>
					</div>
				</div>
				<RaisedButton
					style={{ marginTop: '20px' }}
					disabled={!this.state.vote}
					label='Vote'
					backgroundColor='#66bb6a'
					labelColor='#fff'
					onClick={() => this.handleVote()}
				/>
			</div>
		)
	}
}

export default Reveal;