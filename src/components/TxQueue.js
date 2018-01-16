import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';

import './TxQueue.css';

class TxQueue extends Component {
  render () {
    return (
      <div className='txQueueContainer'>
        <Stepper connector={<span />}>
          <Step>
            <StepLabel className='txQueueLabel'>
              <div style={{flexDirection: 'column', justifyContent: 'space-between', fontSize: '13px'}}>
                <div>
                  <span style={{fontWeight: 600}}>Approve 50000 tokens</span>
                </div>
                <div>Allow adChain Registry contract to transfer adToken deposit from your account.</div>
              </div>
            </StepLabel>
          </Step>
          <Step>
            <StepLabel className='txQueueLabel'>
              <div style={{flexDirection: 'column', justifyContent: 'space-between'}}>
                <div>
                  <span style={{fontWeight: 600}}>Approve 50000 tokens</span>
                </div>
                <div>Allow adChain Registry contract to transfer adToken deposit from your account.</div>
              </div>
            </StepLabel>
          </Step>
        </Stepper>

        <div style={{margin: '0 48px'}}>
          <RaisedButton
            label='Next'
            backgroundColor='#536dfe'
            labelColor='#fff'
          />
        </div>
      </div>
    );
  }
}

export default TxQueue;
