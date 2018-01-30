import TCR, {provider} from '../TCR';
import TransactionManager from './TransactionsManager';
import PromisesQueue from '../utils/PromisesQueue';
import keys from '../i18n';

export async function applyDomain (name, tokensAmount) {
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
        content: keys.formatString(keys.transaction_approveTransferTokensText, { name: 'Random', tokenName: 'Random' })
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
        content: keys.formatString(keys.transaction_approveTransferTokensText, { name: 'Random', tokenName: 'Random' })
      }
    ).add(
      () => listing.challenge(),
      {
        label: keys.transaction_submitChallengeHeader,
        content: keys.formatString(keys.transaction_submitChallengeText, { name: 'Random' })
      }
    );
}
