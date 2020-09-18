import React, { FunctionComponent } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import {
  AcknowledgementPage,
  CongratulationsPage,
  ConnectWalletPage,
  SelectValidatorPage,
  GenerateKeysPage,
  LandingPage,
  NotFoundPage,
  SummaryPage,
  UploadValidatorPage,
  TransactionsPage,
  FAQ,
  Phishing,
} from './pages';
import ScrollToTop from './utils/ScrollToTop';
import { Prysm } from './pages/ValidatorClients/Prysm';
import { Teku } from './pages/ValidatorClients/Teku';
import { Nimbus } from './pages/ValidatorClients/Nimbus';
import { Lighthouse } from './pages/ValidatorClients/Lighthouse';

type RouteType = {
  path: string;
  component: FunctionComponent;
  exact?: boolean;
};

export enum routesEnum {
  congratulationsPage = '/congratulations',
  connectWalletPage = '/connect-wallet',
  generateKeysPage = '/generate-keys',
  acknowledgementPage = '/overview',
  selectValidator = '/select-validator',
  summaryPage = '/summary',
  uploadValidatorPage = '/upload-validator',
  transactionsPage = '/transactions',
  FaqPage = '/faq',
  prysm = '/prysm',
  nimbus = '/nimbus',
  lighthouse = '/lighthouse',
  teku = '/teku',
  phishingPage = '/phishing',
  landingPage = '/',
  notFoundPage = '/*',
}
const routes: RouteType[] = [
  {
    path: routesEnum.congratulationsPage,
    exact: true,
    component: CongratulationsPage,
  },
  {
    path: routesEnum.connectWalletPage,
    exact: true,
    component: ConnectWalletPage,
  },
  {
    path: routesEnum.selectValidator,
    exact: true,
    component: SelectValidatorPage,
  },
  {
    path: routesEnum.generateKeysPage,
    exact: true,
    component: GenerateKeysPage,
  },
  {
    path: routesEnum.acknowledgementPage,
    exact: true,
    component: AcknowledgementPage,
  },
  { path: routesEnum.summaryPage, exact: true, component: SummaryPage },
  {
    path: routesEnum.uploadValidatorPage,
    exact: true,
    component: UploadValidatorPage,
  },
  {
    path: routesEnum.transactionsPage,
    exact: true,
    component: TransactionsPage,
  },
  {
    path: routesEnum.FaqPage,
    exact: true,
    component: FAQ,
  },
  {
    path: routesEnum.teku,
    exact: true,
    component: Teku,
  },
  {
    path: routesEnum.prysm,
    exact: true,
    component: Prysm,
  },
  {
    path: routesEnum.nimbus,
    exact: true,
    component: Nimbus,
  },
  {
    path: routesEnum.lighthouse,
    exact: true,
    component: Lighthouse,
  },
  {
    path: routesEnum.phishingPage,
    exact: true,
    component: Phishing,
  },
  { path: routesEnum.landingPage, exact: true, component: LandingPage },
  { path: routesEnum.notFoundPage, component: NotFoundPage },
];

const _Routes = () => {
  return (
    <>
      <ScrollToTop>
        <Switch>
          {routes.map((route: RouteType) => (
            <Route
              onUpdate={() => window.scrollTo(0, 0)}
              {...route}
              key={route.path}
            />
          ))}
        </Switch>
      </ScrollToTop>
    </>
  );
};

export const Routes = withRouter(_Routes);
