import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Card from 'material-ui/Card';
import LinearProgress from 'material-ui/LinearProgress';
import CopyIcon from 'material-ui/svg-icons/content/content-copy';
import DropZone from 'react-dropzone';
import BN from 'bn.js';
import keys from '../../i18n';
import ListingsList from '../ListingsList';
import UrlUtils from '../../utils/UrlUtils';
import TxQueue from '../TxQueue';
import './style.css';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/CandidateActions';
import * as appActions from '../../actions/AppActions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import BaseUnitsTooltip from '../BaseUnitsTooltip';

class CandidateContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      value: 0,
      listing: '',
      listingError: '',
      file: null,
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
    const registry = UrlUtils.getRegistryAddressByLink();
    if (registry && registry !== this.props.registry) {
      this.props.appActions.changeRegistry(registry);
      return;
    }
    this.props.actions.getCandidateListings();
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
    const { listings, txQueue, showTxQueue, isFetching } = this.props.candidate;
    const { cancelListingApplication } = this.props.actions;
    const useFileUpload = this.props.registry === '0x8708399ec21db3f10764970c76d352694fa76333'; // Is TCR of TCRs
    // TODO: validate this value
    const minCrutch = this.props.parameterizer.parameters[0].value;
    return (
      <div className='ContentContainer'>
        <h3 className='pageHeadline'>{keys.candidatePage_title}</h3>
        <h3> {keys.candidatePage_addListingTitle} </h3>
        <Card>
          {showTxQueue &&
          <TxQueue
            queue={txQueue}
            cancel={cancelListingApplication}
            title={keys.candidatePage_transactionsSteps_title}
            onEnd={this.props.actions.hideTxQueue} />
          }
        </Card>
        {!showTxQueue &&
        <div className='formWrapper'>
          {!useFileUpload &&
          <div className='formItem'>
            <div>{keys.candidate}<span className='requiredIcon'>*</span></div>
            <TextField
              hintText={keys.candidateExample.substr(0, 25)}
              value={this.state.listing}
              errorText={this.state.listingError}
              onChange={(e, value) => {
                this.setState({listing: value});
              }}
            />
          </div>
          }
          {useFileUpload &&
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
                let stake = new BN(value, 10);
                let errorText = stake.gt(0) && stake.lt(new BN(minCrutch, 10)) ? keys.candidatePage_applyForm_stakeErrorText : '';
                this.setState({stake: stake.toString(), stakeError: errorText});
              }}
            />
            <BaseUnitsTooltip />
          </div>
          <div className='formItem'>
            <RaisedButton
              label={keys.apply}
              onClick={() => this.addListing()}
              backgroundColor='#536dfe'
              labelColor='#fff'
              disabled={!!((!this.state.listing && !this.state.file) || !this.state.stake || this.state.listingError || this.state.stakeError)}
              style={{ marginTop: '25px' }}
            />
          </div>
        </div>
        }
        <Card>
          { isFetching
            ? <LinearProgress mode='indeterminate' />
            : listings
              ? <ListingsList
                listings={listings}
                registry={this.props.registry}
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

  addListing () {
    this.props.actions.applyListing(this.state.listing, this.state.stake, this.state.file);
    this.setState({listing: '', stake: 0, file: null});
  }

  onFileSelected (files) {
    this.setState({file: files[0]});
  }
}

function mapStateToProps (state) {
  return {
    candidate: state.candidate,
    registry: state.app.registry,
    parameterizer: state.parameterizer
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    appActions: bindActionCreators(appActions, dispatch)
  };
}

CandidateContainer.propTypes = {
  candidate: PropTypes.object.isRequired,
  registry: PropTypes.string.isRequired,
  parameterizer: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  appActions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(CandidateContainer);
