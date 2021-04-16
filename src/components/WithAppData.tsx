// ** HigherOrderComponent: withSubscriptionsAndPerson
// *** Definition: adds props to the app component

import React from 'react';
import { getUserToken } from 'store/auth';

import {
  useGetUserPersonById,
  useGetUserSubscriptionsById,
} from 'hooks/axiosHooks';

import { Person } from 'types/person';

import App from 'App';

import Center from 'elements/Center';
import LoadingSpinner from 'elements/LoadingSpinner';
import { ClientSubscription } from 'types/subscription';

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

  const isLoading = subscriptionLoading || personLoading;

  const isError = subscriptionError || personError;

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
    />
  );
};

export default WithAppData;
