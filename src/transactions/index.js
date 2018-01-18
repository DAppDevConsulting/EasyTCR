import { Registry } from 'ethereum-tcr-api';

export async function applyDomain (name, tokensAmount, minDeposit) {
  const registry = new Registry(window.contracts.registry, window.Web3);
  const account = await registry.getAccount(window.Web3.eth.defaultAccount);

  // TODO: здесь оставить только данные и идентификаторы транзакций. Сами тексты унести на уровень ui-компонентов
  return constructTxPayload('Make an application to registry', [
    {
      label: `Approve ${minDeposit} Tokens`,
      content: 'Allow AdChain Registry contract to transfer adToken deposit from your account.',
      processed: false,
      exception: false,
      action: () => account.approveTokens(registry.address, tokensAmount)
    },
    {
      label: 'Apply domain',
      content: 'Submit domain application to AdChain registry.',
      processed: false,
      exception: false,
      action: () => registry.createListing(name, tokensAmount)
    }
  ]);
}

function constructTxPayload (title, transactions) {
  return {
    title,
    transactions
  };
}
