import { AccountTab } from './AccountTab';

/** Billing is presented as the same content as the Account tab, deep-linkable via ?tab=billing. */
export function BillingTab({ account, onUpgrade }) {
  return <AccountTab account={account} onUpgrade={onUpgrade} />;
}
