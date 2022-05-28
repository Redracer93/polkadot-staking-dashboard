// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useNotifications } from 'contexts/Notifications';

export const CopyAddress = (props: any) => {
  const { addNotification } = useNotifications();
  const { validator } = props;
  const { address } = validator;

  // copy address notification
  const notificationCopyAddress =
    address == null
      ? {}
      : {
          title: 'Address Copied to Clipboard',
          subtitle: address,
        };

  return (
    <div className="label">
      <button
        type="button"
        onClick={() => addNotification(notificationCopyAddress)}
      >
        <CopyToClipboard text={address}>
          <FontAwesomeIcon icon={faCopy as IconProp} />
        </CopyToClipboard>
      </button>
    </div>
  );
};

export default CopyAddress;
