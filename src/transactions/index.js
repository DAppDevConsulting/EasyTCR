import TCR, {provider} from '../TCR';
import TransactionManager from './TransactionsManager';
import PromisesQueue from '../utils/PromisesQueue';
import keys from '../i18n';

export async function applyDomain (name, tokensAmount, minDeposit) {
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
        label: keys.formatString(keys.transaction_approveTransferTokensHeader, minDeposit),
        content: keys.transaction_approveTransferTokensText
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
