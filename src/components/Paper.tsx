import React from "react";
import { Box, BoxProps } from "grommet";
import styled from "styled-components";

export const Paper = (
  props: {
    children: React.ReactNode;
    className?: string;
    error?: boolean;
    style?: any;
  } & BoxProps
): JSX.Element => {
  return (
    <Box
      border={props.error ? { color: "errorLight", size: "small" } : true}
      className={props.className}
      pad="large"
      background="white"
      round="xsmall"
      {...props}
    >
      {props.children}
    </Box>
  );
};

const BoxGroup = styled(Box)`
  > :first-child {
    border-radius: ${p => `2px 2px 0 0`};
  }
  > :last-child {
    border-radius:${p => `0 0 2px 2px`};
  }
  }
  > *:not(:first-child):not(:last-child) {
    border-radius: 0;
    border-top: none;
    border-bottom: none;
  }
`;

export const PaperGroup = (
  props: {
    children: React.ReactNode;
    className?: string;
    id?: string;
  } & BoxProps
): JSX.Element => {
  return <BoxGroup {...props}>{props.children}</BoxGroup>;
};
