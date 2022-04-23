// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import Wrapper from './Wrapper';
import { useConnect } from '../../contexts/Connect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { AccountDropdown } from '../../library/Form/AccountDropdown';
import { useBalances } from '../../contexts/Balances';
import { useModal } from '../../contexts/Modal';
import { useNotifications } from '../../contexts/Notifications';
import { useExtrinsics } from '../../contexts/Extrinsics';

export const ChangeController = () => {

  const modal = useModal();
  const { addNotification } = useNotifications();
  const { addPending, removePending } = useExtrinsics();
  const { accounts, activeAccount, getAccount } = useConnect();
  const { getBondedAccount }: any = useBalances();
  const controller = getBondedAccount(activeAccount);
  const account = getAccount(controller);

  const [selected, setSelected] = useState(account);

  const handleOnChange = (selected: any) => {
    setSelected(selected);
  }

  // dummy method for submitting transactions
  // TODO: make live
  const submitTx = () => {
    // close modal
    modal.setStatus(0);

    // tx object
    let tx = {
      name: 'set_controller'
    };

    // add to pending transactions context
    addPending(tx);

    // trigger pending tx notification
    addNotification({
      title: 'Transaction Submitted',
      subtitle: 'Updating controller account.',
    });

    // complete transaction after 2 seconds
    setTimeout(() => {

      // remove pending extrinsic
      removePending(tx);

      // trigger completed tx notification
      addNotification({
        title: 'Transaction Successful',
        subtitle: 'Controller account updated.',
      });
    }, 2000);
  }

  return (
    <Wrapper>
      <h3>
        <FontAwesomeIcon transform='grow-2' icon={faExchangeAlt} />
        Change Controller Account
      </h3>
      <AccountDropdown
        items={accounts.filter((acc: any) => acc.address !== activeAccount)}
        onChange={handleOnChange}
        placeholder='Select Account'
        value={selected}
        height='17rem'
      />
      <div className='foot'>
        <div>
          <button className='submit' onClick={() => submitTx()}>
            <FontAwesomeIcon transform='grow-2' icon={faArrowAltCircleUp} />
            Submit
          </button>
        </div>
      </div>
    </Wrapper>
  )
}

export default ChangeController;