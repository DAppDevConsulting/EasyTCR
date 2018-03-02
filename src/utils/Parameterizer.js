import keys from '../i18n'

export const getProposalValue = (proposals, parameterName) =>
	proposals.find(x => x.name === parameterName)
		? proposals.find(x => x.name === parameterName).value
		: null

export const getReadableStatus = status => {
	switch (status) {
		case 'NeedProcess':
			return keys.NeedProcess
		case 'VoteCommit':
			return keys.VoteCommit
		case 'VoteReveal':
			return keys.VoteReveal
		default:
			return keys.inChallenge
	}
}