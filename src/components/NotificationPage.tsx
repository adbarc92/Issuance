import React from 'react';
import { useGetUpdateItems } from 'hooks/axiosHooks';

import RootWrapper from 'elements/RootWrapper';
import LoadingSpinner from 'elements/LoadingSpinner';

const NotificationPage = (): JSX.Element => {
  const { loading, data, error, clearCache } = useGetUpdateItems();

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <RootWrapper>
      {loading ? <LoadingSpinner /> : <div>{data}</div>}
    </RootWrapper>
  );
};

export default NotificationPage;
