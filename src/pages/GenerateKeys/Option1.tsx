import React from 'react';
import styled from 'styled-components';
import { Heading } from '../../components/Heading';
import { Text } from '../../components/Text';
import { Link } from '../../components/Link';
import { Alert } from '../../components/Alert';
import { CHAIN_NAME } from '../../utils/envVars';
import { colors } from '../../styles/styledComponentsTheme';

const Pre = styled.pre`
  white-space: normal;
`;

export const Option1 = ({
  validatorCount,
  os,
}: {
  validatorCount: number | string;
  os: string;
}) => {
  return (
    <div className="mt30">
      <Heading level={2} size="small" color="blueMedium" className="mb20">
        Option 1: Download command line app
      </Heading>
      <Text weight={500}>Download the deposit command line interface app</Text>
      <Text>
        Please find the zip/tarball file containing the latest deposit-cli
        release on the{' '}
        <Link
          primary
          external
          to="https://github.com/ethereum/eth2.0-deposit-cli/releases/"
          inline
        >
          ethereum/eth2.0-deposit-cli
        </Link>{' '}
        GitHub page for your platform.{' '}
      </Text>
      <Alert variant="warning" className="my20">
        <Text weight={500} color="yellowDarkest" className="my10">
          Please make sure that you are downloading from the official Ethereum
          Foundation GitHub account.
        </Text>
      </Alert>
      <Text weight={500}>
        Generate deposit keys using the Ethereum Foundation deposit tool
      </Text>
      <Text className="mt5">
        Decompress the file you just downloaded, use the terminal to move into
        the directory that contains the <code>deposit</code> executable, and run
        the following command to launch the app:
      </Text>
      <Alert variant="secondary" className="my10">
        <Pre className="my10">
          {(os === 'linux' || os === 'mac') && (
            <span style={{ color: colors.red.medium }}>./deposit </span>
          )}
          {os === 'windows' && (
            <>
              <span style={{ color: colors.red.medium }}>deposit</span>
              <span style={{ color: colors.purple.dark }}>.exe </span>
            </>
          )}
          {validatorCount > 0 ? `--num_validators ${validatorCount}` : ''}{' '}
          <span style={{ color: colors.red.medium }}>
            {`--chain ${CHAIN_NAME.toLowerCase()}`}
          </span>
        </Pre>
      </Alert>
      <Text>
        Now follow the instructions presented to you in the terminal window to
        generate your keys.
      </Text>
    </div>
  );
};
