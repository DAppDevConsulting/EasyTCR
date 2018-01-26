import { Registry } from 'ethereum-tcr-api';
import TransactionManager from './TransactionsManager';
import PromisesQueue from '../utils/PromisesQueue';
import api from '../services/BackendApi';

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
        label: `Approve ${minDeposit} Tokens`,
        content: 'Allow AdChain Registry contract to transfer adToken deposit from your account.'
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
        label: 'Apply domain',
        content: 'Submit domain application to AdChain registry.'
      }
    );
}

export async function challengeListing (name, tokensAmount, minDeposit) {
  const registry = new Registry(window.contracts.registry, window.Web3);
  const account = await registry.getAccount(window.Web3.eth.defaultAccount);
  const manager = new TransactionManager(window.contracts.registry, window.Web3);
  // TODO: здесь оставить только данные и идентификаторы транзакций. Сами тексты унести на уровень ui-компонентов
  return new PromisesQueue()
    .add(() => account.approveTokens(registry.address, tokensAmount)
      .then(ti => manager.watchForTransaction(ti)
      ),
    {
      label: `Approve ${minDeposit} Tokens`,
      content: 'Allow Registry contract to transfer tokens deposit from your account.'
    })
    .add(() => registry.challenge(name),
      {
        label: 'Challenge listing',
        content: 'Challenge listing'
      }
    );
}
