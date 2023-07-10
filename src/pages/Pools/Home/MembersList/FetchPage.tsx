// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListItemsPerBatch, ListItemsPerPage } from 'consts';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useSubscan } from 'contexts/Subscan';
import { useTheme } from 'contexts/Themes';
import { motion } from 'framer-motion';
import { Header, List, Wrapper as ListWrapper } from 'library/List';
import { MotionContainer } from 'library/List/MotionContainer';
import { Pagination } from 'library/List/Pagination';
import { ListProvider, useList } from 'library/List/context';
import { useEffect, useRef, useState } from 'react';
import type { Sync } from 'types';
import { Member } from './Member';
import type { MembersListProps, PoolMember } from './types';

export const MembersListInner = ({
  allowMoreCols,
  pagination,
  batchKey,
  title,
  disableThrottle = false,
}: MembersListProps) => {
  const {
    network: { colors, name },
  } = useApi();
  const provider = useList();
  const { mode } = useTheme();
  const { activeAccount } = useConnect();
  const { fetchPoolMembers } = useSubscan();
  const { fetchPoolMembersMetaBatch } = usePoolMembers();
  const { selectedActivePool } = useActivePools();

  // get list provider properties.
  const { listFormat, setListFormat } = provider;

  // current page.
  const [page, setPage] = useState<number>(1);

  // fetched member list for page.
  const [members, setMembers] = useState<PoolMember[]>([]);

  // current render iteration.
  const [renderIteration, setRenderIterationState] = useState<number>(1);

  // whether the page list has been fetched.
  const [fetched, setFetched] = useState<Sync>('unsynced');

  // render throttle iteration.
  const renderIterationRef = useRef(renderIteration);
  const setRenderIteration = (iter: number) => {
    renderIterationRef.current = iter;
    setRenderIterationState(iter);
  };

  // pagination
  const totalPages = Math.ceil(members.length / ListItemsPerPage);
  const pageEnd = page * ListItemsPerPage - 1;
  const pageStart = pageEnd - (ListItemsPerPage - 1);

  // render batch
  const batchEnd = Math.min(
    renderIteration * ListItemsPerBatch - 1,
    ListItemsPerPage
  );

  // get throttled subset or entire list
  const listMembers = disableThrottle
    ? members
    : members.slice(pageStart).slice(0, ListItemsPerPage);

  // handle validator list bootstrapping
  const setupMembersList = async () => {
    const poolId = selectedActivePool?.id || 0;
    if (poolId > 0) {
      const newMembers: PoolMember[] = await fetchPoolMembers(poolId, page);
      setMembers(newMembers);
      fetchPoolMembersMetaBatch(batchKey, newMembers, true);
      setFetched('synced');
    }
  };

  // Refetch list when page changes.
  useEffect(() => {
    setFetched('unsynced');
    setMembers([]);
  }, [page, activeAccount]);

  // Refetch list when network changes.
  useEffect(() => {
    setFetched('unsynced');
    setMembers([]);
    setPage(1);
  }, [name]);

  // Configure list when network is ready to fetch.
  useEffect(() => {
    if (fetched === 'unsynced') {
      setupMembersList();
    }
  }, [fetched, selectedActivePool]);

  // Render throttle.
  useEffect(() => {
    if (!(batchEnd >= pageEnd || disableThrottle)) {
      setTimeout(() => {
        setRenderIteration(renderIterationRef.current + 1);
      }, 500);
    }
  }, [renderIterationRef.current]);

  return (
    <>
      {!members.length ? (
        <></>
      ) : (
        <ListWrapper>
          <Header>
            <div>
              <h4>{title}</h4>
            </div>
            <div>
              <button type="button" onClick={() => setListFormat('row')}>
                <FontAwesomeIcon
                  icon={faBars}
                  color={
                    listFormat === 'row' ? colors.primary[mode] : 'inherit'
                  }
                />
              </button>
              <button type="button" onClick={() => setListFormat('col')}>
                <FontAwesomeIcon
                  icon={faGripVertical}
                  color={
                    listFormat === 'col' ? colors.primary[mode] : 'inherit'
                  }
                />
              </button>
            </div>
          </Header>
          <List flexBasisLarge={allowMoreCols ? '33.33%' : '50%'}>
            {listMembers.length > 0 && pagination && (
              <Pagination page={page} total={totalPages} setter={setPage} />
            )}
            <MotionContainer>
              {listMembers.map((member: PoolMember, index: number) => {
                // fetch batch data by referring to default list index.
                const batchIndex = members.indexOf(member);

                return (
                  <motion.div
                    className={`item ${listFormat === 'row' ? 'row' : 'col'}`}
                    key={`nomination_${index}`}
                    variants={{
                      hidden: {
                        y: 15,
                        opacity: 0,
                      },
                      show: {
                        y: 0,
                        opacity: 1,
                      },
                    }}
                  >
                    <Member
                      who={member.who}
                      batchKey={batchKey}
                      batchIndex={batchIndex}
                    />
                  </motion.div>
                );
              })}
            </MotionContainer>
          </List>
        </ListWrapper>
      )}
    </>
  );
};

export const MembersList = (props: MembersListProps) => {
  const { selectToggleable } = props;

  return (
    <ListProvider selectToggleable={selectToggleable}>
      <MembersListInner {...props} />
    </ListProvider>
  );
};
