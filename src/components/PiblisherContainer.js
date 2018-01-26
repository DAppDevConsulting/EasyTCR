import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Card from 'material-ui/Card';
import keys from '../i18n';
import TCR from '../TCR';
import ListingsList from './ListingsList';
import './PublisherContainer.css';
import TxQueue from './TxQueue';

class PublisherContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      value: 0,
      price: 0,
      domain: '',
      domainError: '',
      stake: 0,
      stakeError: ''
    };

    this.listConfig = {
      columns: [
        {propName: 'name', title: keys.candidatePage_listingName, tooltip: keys.candidatePage_listingTooltip},
        {propName: 'status', title: keys.candidatePage_listingStatus, tooltip: keys.candidatePage_listingStatusTooltip},
        {propName: 'dueDate', title: keys.candidatePage_listingDate, tooltip: keys.candidatePage_listingDateTooltip},
        {propName: 'action', title: keys.candidatePage_listingActions, tooltip: keys.candidatePage_listingActionsTooltip}
      ]
    };
  }

  componentWillMount () {
    // Setting token price for further usage
    TCR.getTokenPrice().then(price => this.setState({ price: parseFloat(price, 16) }));
    this.props.getPublisherDomains();
  }

  render () {
    const { listings, txQueue, showTxQueue } = this.props.publisher;
    const {cancelDomainApplication} = this.props.actions;
    // TODO: validate this value
    const minCrutch = Math.max(this.props.minDeposit, 50000);
    return (
      <div className='ContentContainer'>
        <div>{keys.candidatePage_title}</div>
        <h3> {keys.candidatePage_addListingTitle} </h3>
        <Card className='txqueue-container'>
          {showTxQueue &&
          <TxQueue
            queue={txQueue}
            cancel={cancelDomainApplication}
            title={keys.candidatePage_transactionsSteps_title}
            onEnd={this.props.hideTxQueue} />
          }
        </Card>
        {!showTxQueue &&
        <div className='formWrapper'>
          <div className='formItem'>
            <div>{keys.candidate}<span className='requiredIcon'>*</span></div>
            <TextField
              hintText={keys.candidateExample}
              value={this.state.domain}
              errorText={this.state.domainError}
              onChange={(e, value) => {
                this.setState({domain: value});
              }}
            />
          </div>
          <div className='formItem'>
            <div>{keys.candidatePage_applyForm_stakeTitle}<span className='requiredIcon'>*</span></div>
            <TextField
              hintText={keys.formatString(keys.candidatePage_applyForm_stakeHint, minCrutch)}
              value={this.state.stake || ''}
              errorText={this.state.stakeError}
              onChange={(e, value) => {
                let stake = parseInt(value, 10);
                let errorText = stake > 0 && stake < minCrutch ? keys.candidatePage_applyForm_stakeErrorText : '';
                this.setState({stake: stake, stakeError: errorText});
              }}
            />
          </div>
          <div className='formItem'>
            <RaisedButton
              label={keys.apply}
              onClick={() => this.addDomain()}
              disabled={!!(!this.state.domain || !this.state.stake || this.state.domainError || this.state.stakeError)}
            />
          </div>
        </div>
        }
        <Card>
          <ListingsList
            listings={listings}
            config={this.listConfig}
            onListingAction={() => {}}
          />
        </Card>
      </div>
    );
  }

  getTotalPrice () {
    return (this.state.value || 0) * this.state.price;
  }

  buyTokens () {
    this.props.buyTokens(this.state.value, 10);
  }

  addDomain () {
    this.props.applyDomain(this.state.domain, this.state.stake);
    this.setState({domain: '', stake: 0});
  }
}

PublisherContainer.propTypes = {
  buyTokens: PropTypes.func.isRequired,
  applyDomain: PropTypes.func.isRequired,
  hideTxQueue: PropTypes.func.isRequired,
  getPublisherDomains: PropTypes.func.isRequired,
  publisher: PropTypes.object.isRequired,
  minDeposit: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

export default PublisherContainer;
