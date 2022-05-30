// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PoolAccount } from 'library/PoolAccount';
import { HeadingWrapper } from './Wrappers';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';
import { Account } from '../Account';
import { useStaking } from '../../contexts/Staking';
import { useBalances } from '../../contexts/Balances';
import { usePools } from '../../contexts/Pools';

export const Connected = () => {
  const { activeAccount }: any = useConnect();
  const { openModalWith } = useModal();
  const { hasController, getControllerNotImported } = useStaking();
  const { getBondedAccount }: any = useBalances();
  const controller = getBondedAccount(activeAccount);
  const { activeBondedPool } = usePools();

  let poolAddress = '';
  if (activeBondedPool !== undefined) {
    const { addresses } = activeBondedPool;
    poolAddress = addresses.stash;
  }

  return (
    <>
      {activeAccount !== '' && (
        <>
          {/* default account display / stash label if actively nominating */}
          <HeadingWrapper>
            <Account
              canClick
              onClick={() => {
                openModalWith('ConnectAccounts', {}, 'small');
              }}
              value={activeAccount}
              label={hasController() ? 'Stash' : undefined}
              format="name"
              filled
              wallet
            />
          </HeadingWrapper>

          {/* controller account display / hide if no controller present */}
          {hasController() && (
            <HeadingWrapper>
              <Account
                value={controller}
                title={
                  getControllerNotImported(controller)
                    ? 'Not Imported'
                    : undefined
                }
                format="name"
                label="Controller"
                canClick={hasController()}
                onClick={() => {
                  if (hasController()) {
                    openModalWith('UpdateController', {}, 'large');
                  }
                }}
                filled
              />
            </HeadingWrapper>
          )}

          {/* pool account display / hide if not in pool */}
          {activeBondedPool !== undefined && (
            <HeadingWrapper>
              <PoolAccount
                value={poolAddress}
                title={
                  getControllerNotImported(controller)
                    ? 'Not Imported'
                    : undefined
                }
                pool={activeBondedPool}
                label="Pool"
                canClick={hasController()}
                onClick={() => {}}
                filled
              />
            </HeadingWrapper>
          )}
        </>
      )}
    </>
  );
};
