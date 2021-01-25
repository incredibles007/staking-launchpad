import React from 'react';
import { AcknowledgementIdsEnum } from '../../store/reducers';
import { Link } from '../../components/Link';
import { Text } from '../../components/Text';
import { PRICE_PER_VALIDATOR, TICKER_NAME } from '../../utils/envVars';

export interface PageContentInterface {
  title: string;
  content: JSX.Element;
  acknowledgementText?: string;
}

export const pageContent = {
  [AcknowledgementIdsEnum.introSection]: {
    title: 'Introducing eth2',
    content: (
      <>
        <Text size="large" className="my10">
          Eth2 brings Proof of Stake consensus to Ethereum.
        </Text>
        <Text size="large" className="my10">
          For this, we need active participants - known as validators - to
          propose, verify, and vouch for the validity of blocks. In exchange,
          honest validators receive financial rewards.
        </Text>
        <Text size="large" className="my10">
          Importantly, validators need to post {TICKER_NAME} as collateral - in
          other words, have some funds at stake. The only way to become a
          validator is to make a one-way {TICKER_NAME} transaction to the
          deposit contract on the current Ethereum chain.
        </Text>
        <Link
          external
          to="https://docs.ethhub.io/ethereum-roadmap/ethereum-2.0/proof-of-stake/"
          className="my10"
          primary
          withArrow
        >
          Learn More
        </Link>
      </>
    ),
  },
  [AcknowledgementIdsEnum.signup]: {
    title: 'The Deposit',
    content: (
      <Text size="large" className="my10">
        To become a validator on the beacon chain, you need to deposit{' '}
        {PRICE_PER_VALIDATOR} {` `}
        {TICKER_NAME} per validator that you wish to run. This process cannot be
        reversed.
      </Text>
    ),
    acknowledgementText: `I understand that I need to deposit ${PRICE_PER_VALIDATOR} ${TICKER_NAME} to sign up as a validator, and that the transfer of ${TICKER_NAME} to the beacon chain is one-way, and non-reversible.`,
  },
  [AcknowledgementIdsEnum.responsibilities]: {
    title: 'Responsibilities',
    content: (
      <>
        <Text size="large" className="my10">
          Only validators that actively participate in consensus can receive full
          rewards. Those that are offline are penalized. The onus is on you to
          keep your validator online and up to date. The penalties for being
          offline are roughly equal to the rewards for actively participating.
        </Text>
        <Link
          external
          to="https://docs.google.com/spreadsheets/d/15tmPOvOgi3wKxJw7KQJKoUe-uonbYR6HF7u83LR5Mj4/edit#gid=842896204"
          className="my10"
          primary
          withArrow
        >
          Learn more about eth2 economics
        </Link>
      </>
    ),
    acknowledgementText:
      'I understand that it is important to keep my validator online and updated.',
  },
  [AcknowledgementIdsEnum.slashing]: {
    title: 'Slashing Risks',
    content: (
      <>
        <Text size="large" className="my10">
          Validators that act maliciously, or contrary to the specification, are
          liable to be slashed (incur a large penalty).
        </Text>
        <Link to="/faq" className="my10" primary withArrow>
          Learn More about about slashing
        </Link>
      </>
    ),
    acknowledgementText:
      'I understand that if I act contrary to the specification, I am liable to be slashed.',
  },
  [AcknowledgementIdsEnum.keyManagement]: {
    title: 'Backup Mnemonic',
    content: (
      <Text size="large" className="my10">
        Validator keys are derived from a unique mnemonic (or seed). Your seed
        is the ONLY WAY to withdraw your funds. Above all, keep it safe!
      </Text>
    ),
    acknowledgementText:
      'I understand that my mnemonic is the ‼️ONLY WAY‼️ to withdraw my funds.',
  },
  [AcknowledgementIdsEnum.signingKeys]: {
    title: 'Signing Keys',
    content: (
      <Text size="large" className="my10">
        This Launchpad will help you create keys for each of your validators.
        These keys will be saved in key-stores and you will need to give these
        to your validator software to begin validating. You will also receive a
        deposit file to upload to this website with the public keys for your
        validator.
      </Text>
    ),
    acknowledgementText:
      'I will safeguard my key-stores and give them to my validator software in order to start validating.',
  },
  [AcknowledgementIdsEnum.transferDelay]: {
    title: 'Transfer delay',
    content: (
      <>
        <Text size="large" className="my10">
          Transfers between validators are disabled for now. Validators will
          have to wait until <i>the merge</i> (around two years) to be able to
          withdraw their ${TICKER_NAME}.
        </Text>
        <Link
          external
          to="https://ethereum.org/en/eth2/beacon-chain/#relationship-between-upgrades"
          className="my10"
          primary
          withArrow
        >
          Learn More about the eth2 upgrades
        </Link>
      </>
    ),
    acknowledgementText: `I understand that I CAN NOT TRANSFER my staked ${TICKER_NAME} for a while, and I CAN NOT WITHDRAW until the merge.`,
  },
  [AcknowledgementIdsEnum.commitment]: {
    title: 'Long-term commitment',
    content: (
      <Text size="large" className="my10">
        With transfers disabled for now, there’s no way for a validator to
        voluntarily exit and then restart later. This means validators need to
        be in it for the long haul.
      </Text>
    ),
    acknowledgementText:
      'Once I exit, I can not rejoin until much later. This is a long term commitment.',
  },
  [AcknowledgementIdsEnum.earlyAdoptionRisks]: {
    title: 'Early adopter risks',
    content: (
      <Text size="large" className="my10">
        Validators are participating in the initial launch of a novel network.
        As with any new piece of software, there is the potential for software
        bugs. While unlikely, potential bugs may result in slashing.
      </Text>
    ),
    acknowledgementText:
      'I am an early adopter, and I accept that software and design bugs may result in me being slashed.',
  },
  [AcknowledgementIdsEnum.confirmation]: {
    title: 'Confirmation',
    content: (
      <ul>
        <li>
          <Text size="large" className="my10">
            In order to become a validator, you will generate your new eth2 key
            pairs. To do this and to install the validator software you need to
            be technically capable of running commands in a terminal on a
            computer.
          </Text>
        </li>
        <li>
          <Text size="large" className="my10">
            I have read and agree to the Launchpad{' '}
            <Link inline to="/terms-of-service" className="my10" primary>
              Terms of Service
            </Link>
            .
          </Text>
        </li>
      </ul>
    ),
    acknowledgementText:
      'I agree to all of the previous sections, and I am technically capable of setting up and running a validator',
  },
};
