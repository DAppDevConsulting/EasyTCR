import TCR, {provider} from '../TCR';
import TransactionManager from './TransactionsManager';
import PromisesQueue from '../utils/PromisesQueue';
import keys from '../i18n';

export async function applyListing (name, tokensAmount) {
  const account = await TCR.defaultAccount();
  const manager = new TransactionManager(provider());
  return new PromisesQueue()
    .add(
      () => {
        return account.approveTokens(TCR.registry().address, tokensAmount)
          .then(ti => {
            return manager.watchForTransaction(ti);
          });
      },
      {
        label: keys.formatString(keys.transaction_approveTransferTokensHeader, tokensAmount),
        content: keys.formatString(keys.transaction_approveTransferTokensText, { name: 'TCR', type: 'Registry', tokenName: 'TCR' })
      }
    ).add(
      async () => {
        return TCR.registry().createListing(name, tokensAmount); // TODO: следить за статусом транзакции
      },
      {
        label: keys.candidatePage_transactionsSteps_applyCandidate,
        content: keys.candidatePage_transactionsSteps_applyCandidateText
      }
    );
}

export async function challengeListing (name, tokensAmount) {
  const registry = TCR.registry();
  const account = await TCR.defaultAccount();
  const listing = await registry.getListing(name);
  const manager = new TransactionManager(provider());
  // TODO: здесь оставить только данные и идентификаторы транзакций. Сами тексты унести на уровень ui-компонентов
  return new PromisesQueue()
    .add(
      () => {
        return account.approveTokens(TCR.registry().address, tokensAmount)
          .then(ti => {
            return manager.watchForTransaction(ti);
          });
      },
      {
        label: keys.formatString(keys.transaction_approveTransferTokensHeader, tokensAmount),
        content: keys.formatString(keys.transaction_approveTransferTokensText, { name: keys.registryName, type: 'Registry', tokenName: keys.tokenName })
      }
    ).add(
      () => listing.challenge(),
      {
        label: keys.transaction_submitChallengeHeader,
        content: keys.formatString(keys.transaction_submitChallengeText, { name: keys.registryName })
      }
    );
}

export async function commitVote (id, hash, stake) {
  // const registry = TCR.registry();
  const account = await TCR.defaultAccount();
  const plcr = await TCR.getPLCRVoting();
  const poll = plcr.getPoll(id);
  const manager = new TransactionManager(provider());

  return new PromisesQueue()
    // Approve tokens to PLCRVoting contract
    .add(
      () => {
        return account.approveTokens(plcr.address, stake)
          .then(ti => {
            return manager.watchForTransaction(ti);
          });
      },
      {
        label: keys.formatString(keys.transaction_approveTransferTokensHeader, stake),
        content: keys.formatString(keys.transaction_approveTransferTokensText, { name: keys.registryName, type: 'PLCR', tokenName: keys.tokenName })
      }
    ).add(
      () => plcr.requestVotingRights(stake),
      {
        label: keys.formatString(keys.transaction_requestVotingRightsHeader, stake),
        content: keys.transaction_requestVotingRightsText
      }
    ).add(
      () => poll.commitVote(hash, stake),
      {
        label: keys.transaction_commitVoteHeader,
        content: keys.transaction_commitVoteText
      }
    );
}

export async function revealVote (id, option, salt) {
  const plcr = await TCR.getPLCRVoting();
  const poll = plcr.getPoll(id);

  return new PromisesQueue()
  // Approve tokens to PLCRVoting contract
    .add(
      () => poll.revealVote(option, salt).catch((err) => console.log(err)),
      {
        label: keys.transaction_revealVoteHeader,
        content: keys.transaction_revealVoteText
      }
    );
}

export async function refreshListingStatus (name) {
  const registry = TCR.registry();
  const listing = await registry.getListing(name);

  return listing.updateStatus()
    .catch(error => console.error(error));
}

export async function claimReward (challengeId, salt) {
  const manager = new TransactionManager(provider());
  const challenge = TCR.registry().getChallenge(challengeId);
  const ti = await challenge.claimReward(salt);
  await manager.watchForTransaction(ti);
}
