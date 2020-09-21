import React, { useState } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import _shuffle from 'lodash/shuffle';
import { StoreState } from '../../store/reducers';
import { WorkflowPageTemplate } from '../../components/WorkflowPage/WorkflowPageTemplate';
import { routeToCorrectWorkflowStep } from '../../utils/RouteToCorrectWorkflowStep';
import SelectClientSection from './SelectClientSection';
import SelectClientButtons from './SelectClientButtons';
import { PrysmDetails } from '../Clients/Prysm';
import { LighthouseDetails } from '../Clients/Lighthouse';
import { TekuDetails } from '../Clients/Teku';
import { NimbusDetails } from '../Clients/Nimbus';
import PrysmaticCircle from '../../static/prysmatic-labs-circle.png';
import LighthouseCircle from '../../static/lighthouse-circle.png';
import NimbusCircle from '../../static/nimbus-circle.png';
import TekuCircle from '../../static/pegasys-teku-circle.png';
import ParityCircle from '../../static/parity-circle.png';
import GethCircle from '../../static/gethereum-mascot-circle.png';
import BesuCircle from '../../static/hyperledger-besu-circle.png';
import NethermindCircle from '../../static/nethermind-circle.png';

import {
  DispatchWorkflowUpdateType,
  updateWorkflow,
  WorkflowStep,
} from '../../store/actions/workflowActions';
import {
  DispatchClientUpdate,
  updateClient,
  ClientId,
} from '../../store/actions/clientActions';
import { clientState } from '../../store/reducers/clientReducer';

// Prop definitions
interface OwnProps {}
interface StateProps {
  workflow: WorkflowStep;
  chosenClients: clientState;
}

interface DispatchProps {
  dispatchWorkflowUpdate: DispatchWorkflowUpdateType;
  dispatchClientUpdate: DispatchClientUpdate;
}
type Props = StateProps & DispatchProps & OwnProps;

const clientDetails = {
  [ClientId.TEKU]: <TekuDetails shortened />,
  [ClientId.LIGHTHOUSE]: <LighthouseDetails shortened />,
  [ClientId.PRYSM]: <PrysmDetails shortened />,
  [ClientId.NIMBUS]: <NimbusDetails shortened />,
};

export type Client = {
  clientId: ClientId;
  name: string;
  imgUrl: string;
};

// define and shuffle the clients
const ethClients: {
  [ethVersion: number]: Array<Client>;
} = {
  1: _shuffle([
    {
      clientId: ClientId.PARITY,
      name: 'OpenEthereum',
      imgUrl: ParityCircle,
    },
    { clientId: ClientId.GETH, name: 'Geth', imgUrl: GethCircle },
    { clientId: ClientId.BESU, name: 'Besu', imgUrl: BesuCircle },
    {
      clientId: ClientId.NETHERMIND,
      name: 'Nethermind',
      imgUrl: NethermindCircle,
    },
  ]),
  2: _shuffle([
    { clientId: ClientId.TEKU, name: 'Teku', imgUrl: TekuCircle },
    {
      clientId: ClientId.LIGHTHOUSE,
      name: 'Lighthouse',
      imgUrl: LighthouseCircle,
    },
    {
      clientId: ClientId.PRYSM,
      name: 'Prysm',
      imgUrl: PrysmaticCircle,
    },
    { clientId: ClientId.NIMBUS, name: 'Nimbus', imgUrl: NimbusCircle },
  ]),
};

const _SelectClientPage = ({
  workflow,
  dispatchWorkflowUpdate,
  chosenClients,
  dispatchClientUpdate,
}: Props): JSX.Element => {
  // set the default the eth version to 1 on initial render
  const [ethVersionStep, setEthVersionStep] = useState<1 | 2>(1);

  // filter the options based on the eth version the user is on
  const clientOptions = React.useMemo(() => ethClients[ethVersionStep], [
    ethVersionStep,
  ]);

  // memoize the chosen client by step
  const selectedClient: ClientId = React.useMemo(
    () =>
      ethVersionStep === 1
        ? chosenClients.eth1Client
        : chosenClients.eth2Client,
    [ethVersionStep, chosenClients]
  );

  const setClientFxn = (clientId: ClientId) => {
    dispatchClientUpdate(clientId, ethVersionStep);
  };

  React.useEffect(() => {
    const header = document.getElementsByTagName('header')[0];

    if (header) {
      header.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ethVersionStep]);

  const handleSubmit = () => {
    if (workflow === WorkflowStep.SELECT_CLIENT) {
      dispatchWorkflowUpdate(WorkflowStep.TRANSACTION_SIGNING);
    }
  };

  if (workflow < WorkflowStep.SELECT_CLIENT)
    return routeToCorrectWorkflowStep(workflow);

  return (
    <WorkflowPageTemplate title="Client Selection">
      <SelectClientSection
        title={`Choose your Eth ${ethVersionStep} client and set up a node`}
        clients={clientOptions}
        currentClient={selectedClient}
        setCurrentClient={setClientFxn}
        clientDetails={clientDetails}
      />
      <div className="flex center p30">
        <SelectClientButtons
          updateStep={setEthVersionStep}
          ethVersionStep={ethVersionStep}
          handleSubmit={handleSubmit}
          currentClient={selectedClient}
        />
      </div>
    </WorkflowPageTemplate>
  );
};

const mapStateToProps = ({ workflow, client }: StoreState): StateProps => ({
  workflow,
  chosenClients: client,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  dispatchClientUpdate: (clientId: ClientId, ethVersion: 1 | 2) => {
    dispatch(updateClient(clientId, ethVersion));
  },
  dispatchWorkflowUpdate: (step: WorkflowStep) => {
    dispatch(updateWorkflow(step));
  },
});

export const SelectClientPage = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  StoreState
>(
  mapStateToProps,
  mapDispatchToProps
)(_SelectClientPage);
