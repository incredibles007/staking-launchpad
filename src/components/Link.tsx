import React from 'react';
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { FormNext } from 'grommet-icons';

interface LinkProps {
  primary?: boolean | undefined;
  theme?: any;
  className?: string;
  href?: string;
  inline?: boolean;
  isTextLink?: boolean;
}

const styles = `
  line-height: 33px;
  color:inherit;
  display: inherit;
  text-decoration: none;
  &:hover {
    font-weight: 400;
  };
  &:focus,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  };
 `;

const StyledExternalLink = styled.a<
  Pick<LinkProps, 'primary' | 'theme' | 'inline' | 'isTextLink'>
>`
  ${styles};
  color: ${(props: any) =>
    props.primary ? props.theme.blue.medium : 'inherit'};
  display: ${(props: any) => (props.inline ? 'inline' : 'inherit')};
  &:after {
    display: ${(props: any) => (props.isTextLink ? `inline` : `none`)};
    margin-left: 0.125em;
    margin-right: 0.3em;
    content: '↗';
    transition: all 0.1s ease-in-out;
    font-style: normal;
  }
`;
const StyledLink = styled(RouterLink)`
  ${styles};
  color: ${(props: any) =>
    props.primary ? props.theme.blue.medium : 'inherit'};
  display: ${(props: any) => (props.inline ? 'inline' : 'inherit')};
`;
const Arrow = styled(FormNext)`
  transform: translate(0px, 6px);
  stroke: ${(props: any) =>
    props.primary ? props.theme.blue.medium : 'inherit'};
`;

interface LinkProps {
  to: string;
  key?: string;
  children: React.ReactNode;
  className?: string;
  primary?: boolean | undefined;
  onClick?: (param?: any) => void;
  inline?: boolean;
  withArrow?: boolean;
}

export const Link = (props: LinkProps) => {
  const { children, className, to, primary, inline, withArrow } = props;
  const { locale } = useIntl();
  const isExternal = to && to.includes('http');

  if (isExternal) {
    const isTextLink = typeof children === 'string';
    return (
      <StyledExternalLink
        className={className}
        href={to}
        primary={primary}
        target="_blank"
        inline={inline}
        isTextLink={isTextLink}
      >
        {children}
        {withArrow && (
          // @ts-ignore
          <Arrow primary={primary} />
        )}
      </StyledExternalLink>
    );
  }
  const langPath = `/${locale}${to}`;
  return (
    <StyledLink className={className} {...props} to={langPath}>
      {children}
      {withArrow && <Arrow primary={primary} />}
    </StyledLink>
  );
};
