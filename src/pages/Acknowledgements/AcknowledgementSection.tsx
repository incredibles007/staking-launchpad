import React from "react";
import { CheckBox, Heading } from "grommet";
import { Paper, PaperGroup } from "../../components/Paper";
import { acknowledgementId } from ".";

export interface AcknowledgementSectionData {
  id: acknowledgementId;
  title: string;
  content: JSX.Element;
  acknowledgement: {
    id: acknowledgementId;
    text: string;
  };
}
export interface AcknowledgementSectionProps {
  handleCheckboxClick(id: acknowledgementId, checked: boolean): void;
  agreedTo: boolean;
}

export const AcknowledgementSection = ({
  title,
  content,
  acknowledgement,
  handleCheckboxClick,
  agreedTo
}: AcknowledgementSectionProps & AcknowledgementSectionData): JSX.Element => {
  const onCheckboxClick = (event: any) =>
    handleCheckboxClick(acknowledgement.id, event.target.checked);

  return (
    <PaperGroup className="my10" id={acknowledgement.id}>
      <Paper>
        <Heading level={3} size="small" color="brand">
          {title}
        </Heading>
        {content}
      </Paper>
      {acknowledgement && (
        <Paper>
          <CheckBox
            onChange={onCheckboxClick}
            checked={agreedTo}
            label={acknowledgement.text}
          />
        </Paper>
      )}
    </PaperGroup>
  );
};
