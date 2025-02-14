// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faCircleArrowRight,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { stringUpperFirst } from '@polkadot/util';
import { ButtonPrimary, PageRow } from '@polkadot-cloud/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useConnect } from 'contexts/Connect';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { useOverlay } from '@polkadot-cloud/react/hooks';

export const ControllerNotStash = () => {
  const { t } = useTranslation('pages');
  const { network } = useApi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { addressDifferentToStash } = useStaking();
  const { getBondedAccount } = useBonded();
  const { openModal } = useOverlay().modal;
  const { isSyncing } = useUi();
  const controller = getBondedAccount(activeAccount);

  const [showPrompt, setShowPrompt] = useState<boolean>(
    addressDifferentToStash(controller)
  );

  useEffect(() => {
    setShowPrompt(addressDifferentToStash(controller));
  }, [controller]);

  return (
    <>
      {showPrompt
        ? !isSyncing &&
          !isReadOnlyAccount(activeAccount) && (
            <PageRow>
              <CardWrapper $warning>
                <CardHeaderWrapper>
                  <h3>
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    &nbsp; {t('nominate.controllerAccountsDeprecated')}
                  </h3>
                  <h4>
                    {t('nominate.proxyprompt')} {stringUpperFirst(network.name)}
                    .
                  </h4>
                </CardHeaderWrapper>
                <div>
                  <ButtonPrimary
                    text={t('nominate.updateToStash')}
                    iconLeft={faCircleArrowRight}
                    onClick={() => openModal({ key: 'UpdateController' })}
                  />
                </div>
              </CardWrapper>
            </PageRow>
          )
        : null}
    </>
  );
};
