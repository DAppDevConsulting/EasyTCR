export const CONSUMER = '/consumer/:registry';
export const LINK_TO_CONSUMER = '/consumer/';
export const APPLICANT = '/applicant/:registry';
export const LINK_TO_APPLICANT = '/applicant/';
export const CANDIDATE = '/candidate/:registry/:candidateId';
export const MANAGE_TOKENS = '/manage_tokens/:registry';
export const LINK_TO_MANAGE_TOKENS = '/manage_tokens/';
export const TOKEN_HOLDER = '/token_holder/:registry';
export const LINK_TO_TOKEN_HOLDER = '/token_holder/';
export const PARAMETERIZER = '/parameterizer/:registry';
export const LINK_TO_PARAMETERIZER = '/parameterizer/';

export function toPath (link, registryAddress) {
  return link.replace(':registry', registryAddress);
}
