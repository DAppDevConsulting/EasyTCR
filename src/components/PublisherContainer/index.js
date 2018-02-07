import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Card from 'material-ui/Card';
import CopyIcon from 'material-ui/svg-icons/content/content-copy';
import DropZone from 'react-dropzone';
import keys from '../../i18n';
import TCR from '../../TCR';
import ListingsList from '../ListingsList';
import TxQueue from '../TxQueue';
import './style.css';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/PublisherActions';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';

class PublisherContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      value: 0,
      price: 0,
      file: null,
      domain: '',
      domainError: '',
      stake: 0,
      stakeError: ''
    };

    this.listConfig = {
      columns: [
        {propName: 'label', title: keys.candidatePage_listingName, tooltip: keys.candidatePage_listingTooltip},
        {propName: 'status', title: keys.candidatePage_listingStatus, tooltip: keys.candidatePage_listingStatusTooltip},
        {propName: 'dueDate', title: keys.candidatePage_listingDate, tooltip: keys.candidatePage_listingDateTooltip},
        {propName: 'action', title: keys.candidatePage_listingActions, tooltip: keys.candidatePage_listingActionsTooltip}
      ]
    };
  }

  componentWillMount () {
    // Setting token price for further usage
    TCR.getTokenPrice().then(price => this.setState({ price: parseFloat(price, 16) }));
    this.props.actions.getPublisherDomains();
  }

  // only for English
  renderLink (key) {
    const parts = key.split('or ');
    const parts2 = parts[1].split(' to');

    return (
      <div style={{ display: 'inline-block' }}>
        { parts[0] }or&nbsp;
        <Link to='manage_tokens' style={{ textDecoration: 'underline' }}>{parts2[0]}</Link>
        &nbsp;to{ parts2[1] }
      </div>
    );
  }

  render () {
    const { listings, txQueue, showTxQueue, useIpfs } = this.props.publisher;
    const {cancelDomainApplication} = this.props.actions;
    // TODO: validate this value
    const minCrutch = Math.max(this.props.parametrizer.minDeposit, 50000);
    return (
      <div className='ContentContainer'>
        <div>{keys.candidatePage_title}</div>
        <h3> {keys.formatString(keys.candidatePage_addListingTitle, {candidate: keys.candidate})} </h3>
        <Card className='txqueue-container'>
          {showTxQueue &&
          <TxQueue
            queue={txQueue}
            cancel={cancelDomainApplication}
            title={keys.candidatePage_transactionsSteps_title}
            onEnd={this.props.actions.hideTxQueue} />
          }
        </Card>
        {!showTxQueue &&
        <div className='formWrapper'>
          {!useIpfs &&
          <div className='formItem'>
            <div>{keys.candidate}<span className='requiredIcon'>*</span></div>
            <TextField
              hintText={keys.candidateExample.substr(0, 25)}
              value={this.state.domain}
              errorText={this.state.domainError}
              onChange={(e, value) => {
                this.setState({domain: value});
              }}
            />
          </div>
          }
          {useIpfs &&
          <div className='formItem'>
            <div>{keys.candidate_configFile}<span className='requiredIcon'>*</span></div>
            <DropZone
              multiple={false}
              accept='application/json'
              onDrop={(files) => this.onFileSelected(files)}
              style={{
                border: 'dashed 1px rgba(127, 143, 164, 0.4)',
                height: '130px',
                textAlign: 'center',
                padding: '20px 0',
                boxSizing: 'border-box'
              }}
            >
              <CopyIcon style={{ width: '32px', height: '40px', color: 'rgba(127, 143, 164, 0.4)', marginBottom: '5px', flex: '1 1 auto' }} />
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#7f8fa4', margin: '0' }}>Drag files here</h2>
              <p style={{ margin: '0' }}>or <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>browse your computer</span></p>
            </DropZone>
            <div>{this.state.file ? this.state.file.name : ''}</div>
          </div>
          }
          <div className='formItem'>
            <div>{this.renderLink(keys.candidatePage_applyForm_stakeTitle)}<span className='requiredIcon'>*</span></div>
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
              backgroundColor='#536dfe'
              labelColor='#fff'
              disabled={!!((!this.state.domain && !this.state.file) || !this.state.stake || this.state.domainError || this.state.stakeError)}
              style={{ marginBottom: '8px' }}
            />
          </div>
        </div>
        }
        <Card>
          { listings
            ? <ListingsList
              listings={listings}
              config={this.listConfig}
            />
            : <div style={{ padding: '10px', textAlign: 'center' }}>{`No ${keys.candidate}s yet`}</div>
          }
        </Card>
      </div>
    );
  }

  getTotalPrice () {
    return (this.state.value || 0) * this.state.price;
  }

  buyTokens () {
    this.props.actions.buyTokens(this.state.value, 10);
  }

  addDomain () {
    this.props.actions.applyDomain(this.state.domain, this.state.stake, this.state.file);
    this.setState({domain: '', stake: 0, file: null});
  }

  onFileSelected (files) {
    this.setState({file: files[0]});
  }
}

function mapStateToProps (state) {
  return {
    publisher: state.publisher,
    parametrizer: state.parameterizer
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

PublisherContainer.propTypes = {
  publisher: PropTypes.object.isRequired,
  parametrizer: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(PublisherContainer);
