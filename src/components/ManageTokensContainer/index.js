import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/PublisherActions';
import {connect} from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import BN from 'bn.js';
import TCR from '../../TCR';
import keys from '../../i18n';
import './style.css';

class ManageTokensContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value: '',
      multiplier: 1,
      price: ''
    };
    this.weiToEthConverter = (wei) => wei; // TODO: сделать один конвертер. Кажется там константные значения везде.
    this.weiToEthLimit = new BN('1000000000000000', 10);
  }

  componentWillMount () {
    // Setting token price for further usage
    this.weiToEthConverter = TCR.fromWei;
    TCR.getTokenPrice('wei').then(price => this.setState({ price: price.toString() }));
  }

  render () {
    const { tokens, ethers, fetching } = this.props.publisher;
    const balanceText = keys.formatString(
      keys.manageTokensPage_balanceText,
      {tokens, tokenName: keys.tokenName, ethers, eth: keys.eth}
    );
    const labelText = keys.formatString(
      keys.manageTokensPage_rate,
      {price: this.state.price, wei: keys.wei, tokenName: keys.tokenName}
    );
    return (
      <div className='ContentContainer'>
        <h4 className='sectionTitle'>{keys.manageTokensPage_title}</h4>
        <h3 className='manageTokensTitle'> {keys.manageTokensPage_balanceHeader} </h3>
        <p className='balanceText'>{tokens ? balanceText : 'Updating...' }</p>
        <h3 className='manageTokensTitle'> {keys.manageTokensPage_buyTokensHeader} </h3>
        <div className='buyTokensForm'>
          <div className='buyTokensForm_item'>
            <div className='buyTokensForm_element'>
              <TextField
                floatingLabelText={labelText}
                floatingLabelFixed
                hintText={keys.manageTokensPage_buyTokensHint}
                value={this.state.value || ''}
                onChange={(e, value) => this.setState({ value: new BN(value, 10) })} />
            </div>
            <div className='buyTokensForm_element'>
              <RaisedButton
                label={keys.buy}
                disabled={!this.state.value}
                onClick={() => this.buyTokens()}
                backgroundColor='#66bb6a'
                labelColor='#fff'
                style={{ marginBottom: '8px' }}
              />
            </div>
          </div>
        </div>
        {/* <div>{keys.formatString(keys.manageTokensPage_supposedTokens, this.getTokensToBuy().toString(), keys.tokenName)}</div> */}
        <p className='balanceText'>{keys.formatString(keys.manageTokensPage_supposedPrice, this.getTotalPriceText())}</p>
      </div>
    );
  }

  buyTokens () {
    this.props.actions.buyTokens(this.getTokensToBuy());
    this.setState({value: ''});
  }

  getTokensToBuy () {
    const tokens = new BN(this.state.value || 0, 10);
    const multiplier = new BN(this.state.multiplier, 10);
    return tokens.mul(multiplier);
  }

  getTotalPrice () {
    const price = new BN(this.state.price, 10);
    return this.getTokensToBuy().mul(price);
  }

  getTotalPriceText () {
    const price = this.getTotalPrice();
    if (price.lt(this.weiToEthLimit)) {
      return price.toString() + ` ${keys.wei}`;
    }

    return parseFloat(this.weiToEthConverter(price.toString())) + ` ${keys.eth}`;
  }
}

function mapStateToProps (state) {
  return {
    publisher: state.publisher
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

ManageTokensContainer.propTypes = {
  publisher: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageTokensContainer);
