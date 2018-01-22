import { Registry } from 'ethereum-tcr-api';
import TransactionManager from './TransactionsManager';

export async function applyDomain (name, tokensAmount, minDeposit) {
  const registry = new Registry(window.contracts.registry, window.Web3);
  const account = await registry.getAccount(window.Web3.eth.defaultAccount);
  const manager = new TransactionManager(window.contracts.registry, window.Web3);

  // TODO: здесь оставить только данные и идентификаторы транзакций. Сами тексты унести на уровень ui-компонентов
  return constructTxPayload('Make an application to registry', [
    {
      label: `Approve ${minDeposit} Tokens`,
      content: 'Allow AdChain Registry contract to transfer adToken deposit from your account.',
      processed: false,
      exception: false,
      action: () => {
        return account.approveTokens(registry.address, tokensAmount)
          .then(ti => {
            return manager.watchForTransaction(ti);
          });
      }
    },
    {
      label: 'Apply domain',
      content: 'Submit domain application to AdChain registry.',
      processed: false,
      exception: false,
      action: () => {
        return registry.createListing(name, tokensAmount); // TODO: следить за статусом транзакции
          /*.then(ti => {
            return manager.watchForTransaction(ti);
          });*/
      }
    }
  ]);
}

function constructTxPayload (title, transactions) {
  return {
    title,
    transactions
  };
}
