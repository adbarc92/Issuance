// ** HigherOrderComponent: withSubscriptionsAndPerson
// *** Definition: adds props to the app component

import React from 'react';
import { getUserToken } from 'store/auth';

import {
  useGetUserPersonById,
  useGetUserSubscriptionsById,
  useGetUserById,
} from 'hooks/axiosHooks';

import { Person } from 'types/person';

import App from 'App';

import Center from 'elements/Center';
import LoadingSpinner from 'elements/LoadingSpinner';
import { ClientSubscription } from 'types/subscription';
import { ClientUser } from 'types/user';

const WithAppData = (): JSX.Element => {
  const userId = getUserToken() ?? '';

  const {
    loading: subscriptionLoading,
    data: subscriptionData,
    error: subscriptionError,
  } = useGetUserSubscriptionsById(userId);

  const {
    loading: personLoading,
    data: personData,
    error: personError,
  } = useGetUserPersonById(userId);

  const {
    loading: userLoading,
    data: userData,
    error: userError,
  } = useGetUserById(userId);

  const isLoading = subscriptionLoading || personLoading || userLoading;

  const isError = subscriptionError || personError || userError;

  if (isLoading || isError) {
    return (
      <Center>
        <LoadingSpinner />
      </Center>
    );
  }

  return (
    <App
      person={personData as Person}
      subscriptions={subscriptionData as ClientSubscription[]}
      user={userData as ClientUser}
    />
  );
};

export default WithAppData;
