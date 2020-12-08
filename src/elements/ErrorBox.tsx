import React from 'react';

import { Alert } from '@material-ui/lab';

interface ErrorBoxProps {
  errors: Record<string, string>;
}

const ErrorBox = (props: ErrorBoxProps): JSX.Element => {
  return (
    <div>
      {Object.values(props.errors).map((errorMessage, index) => {
        return (
          <Alert severity="error" key={index}>
            {errorMessage}
          </Alert>
        );
      })}
    </div>
  );
};

export default ErrorBox;
