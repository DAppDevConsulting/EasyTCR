import React from 'react';
import { Link } from 'react-router-dom';
import keys from '../../i18n';
import './style.css';
import Image from './image';

const NoMatch = () => (
	<div className='notFound'>
	  <h1 className='notFoundTitle'>{keys.notFoundTitle}</h1>
	  <Image color={keys.accentColor} />
	  <p className='notFoundText'>
		  {keys.notFoundTextFirst}
		  <br />
		  {keys.formatString(
				keys.notFoundTextSecond,
			  {
				  goHome: <Link to='/'>{keys.notFoundGoHome}</Link>,
				  reportIssue: <a href={`mailto:${keys.email}`}>{keys.notFoundReportIssue}</a>
				}
		  )}
	  </p>
	</div>
)

export default NoMatch;