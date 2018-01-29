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

export async function challengeListing (name, tokensAmount) {
  const registry = TCR.registry();
  const account = await registry.getAccount(TCR.defaultAccount());
  const listing = await registry.getListing(name);
  const manager = new TransactionManager(window.contracts.registry, window.Web3);
  // TODO: здесь оставить только данные и идентификаторы транзакций. Сами тексты унести на уровень ui-компонентов
  return new PromisesQueue()
    .add(() => account.approveTokens(registry.address, tokensAmount)
      .then(ti => manager.watchForTransaction(ti)
      ),
    {
      label: `Approve ${tokensAmount} Tokens`,
      content: 'Allow Registry contract to transfer tokens deposit from your account.'
    })
    .add(() => listing.challenge(),
      {
        label: 'Challenge listing',
        content: 'Challenge listing'
      }
    );
}
