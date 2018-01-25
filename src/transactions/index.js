import { Registry } from 'ethereum-tcr-api';
import TransactionManager from './TransactionsManager';
import PromisesQueue from '../utils/PromisesQueue';
import api from '../services/BackendApi';
import keys from '../i18n';

export async function applyDomain (name, tokensAmount, minDeposit) {
  const registry = new Registry(window.contracts.registry, window.Web3);
  const account = await registry.getAccount(window.Web3.eth.defaultAccount);
  const manager = new TransactionManager(window.contracts.registry, window.Web3);
  // TODO: здесь оставить только данные и идентификаторы транзакций. Сами тексты унести на уровень ui-компонентов
  return new PromisesQueue()
    .add(
      () => {
        return account.approveTokens(registry.address, tokensAmount)
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
        try {
          await api.addListing(name, account.owner);
        } catch (err) {
          console.log(err);
        }
        return registry.createListing(name, tokensAmount); // TODO: следить за статусом транзакции
      },
      {
        label: keys.candidatePage_transactionsSteps_applyCandidate,
        content: keys.candidatePage_transactionsSteps_applyCandidateText
      }
    );
}
