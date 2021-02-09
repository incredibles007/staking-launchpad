import React from 'react';
import styled from 'styled-components';
import { Heading } from '../../components/Heading';
import { Text } from '../../components/Text';
import { Link } from '../../components/Link';
import { Alert } from '../../components/Alert';
import { Code } from '../../components/Code';
import { ETH2_NETWORK_NAME, IS_MAINNET } from '../../utils/envVars';
import { Button } from '../../components/Button';
import { Alert as GrommetAlert } from 'grommet-icons';
import githubScreenshot from '../../static/github-cli-screenshot.png';
import { colors } from '../../styles/styledComponentsTheme';
import { FormattedMessage } from 'react-intl';

const AlertIcon = styled(p => <GrommetAlert {...p} />)`
  display: block;
  margin: 1.3rem;
`;

const Pre = styled.pre`
  white-space: normal;
`;

const GithubScreenshot = styled.img.attrs({ src: githubScreenshot })`
  max-width: 925px;
  width: 100%;
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
        Download command line app
      </Heading>
      <Text weight={500}>
        Step 1: Download the deposit command line interface app for your
        operating system
      </Text>
      <Link
        to="https://github.com/ethereum/eth2.0-deposit-cli/releases/"
        className="my40"
      >
        <Button className="flex" rainbow label="Download from GitHub" />
      </Link>

      <Alert variant="warning" className="my40">
        <div className="flex">
          <AlertIcon />
          <Text
            weight={500}
            color="yellowDarkest"
            className="my10"
            style={{ wordBreak: 'break-word' }}
          >
            <FormattedMessage
              defaultMessage="Please make sure that you are downloading from the official Ethereum
              Foundation GitHub account by verifying the url: {url}"
              values={{
                url: (
                  <strong>
                    https://github.com/ethereum/eth2.0-deposit-cli/releases/
                  </strong>
                ),
              }}
            />
          </Text>
        </div>
      </Alert>

      <GithubScreenshot />

      <Text weight={500} className="mt20">
        Step 2: Generate deposit keys using the Ethereum Foundation deposit tool
      </Text>
      <Alert className="my20" variant="info">
        For security, we recommend you disconnect from the internet to complete
        this step.
      </Alert>
      <ul>
        <li>Decompress the file you just downloaded</li>
        <li>
          <FormattedMessage
            defaultMessage="Use the terminal to move into the directory that contains the {deposit} executable"
            values={{
              deposit: <code>deposit</code>,
            }}
          />
        </li>
        <li>Run the following command to launch the app</li>
        <Alert variant="secondary" className="my10">
          <Pre className="my10">
            {(os === 'linux' || os === 'mac') && (
              <span style={{ color: colors.red.medium }}>./deposit </span>
            )}
            {os === 'windows' && (
              <>
                <span style={{ color: colors.red.medium }}>.\deposit</span>
                <span style={{ color: colors.purple.dark }}>.exe </span>
              </>
            )}
            <span style={{ color: colors.red.medium }}>new-mnemonic</span>
            <span style={{ color: colors.red.medium }}>
              {validatorCount > 0 ? ` --num_validators ${validatorCount}` : ''}{' '}
            </span>
            <span style={{ color: colors.red.medium }}>
              {`--chain ${ETH2_NETWORK_NAME.toLowerCase()}`}
            </span>
          </Pre>
        </Alert>
        <Alert variant="error" className="my10">
          <Text>
            <FormattedMessage
              defaultMessage="Please make sure you have set {flag} for {network}, otherwise the deposit will be invalid."
              values={{
                flag: <Code>--chain {ETH2_NETWORK_NAME.toLowerCase()}</Code>,
                network: (
                  <span>
                    {ETH2_NETWORK_NAME.charAt(0).toUpperCase()}
                    {ETH2_NETWORK_NAME.toLowerCase().slice(1)}
                    {!IS_MAINNET && ' testnet'}
                  </span>
                ),
              }}
            />
          </Text>
        </Alert>
        <li>
          Now follow the instructions presented to you in the terminal window to
          generate your keys.
        </li>
      </ul>
    </div>
  );
};
