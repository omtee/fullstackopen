import React from "react";
import { Icon, Segment } from "semantic-ui-react";
import { OccupationalHealthcareEntry } from "../types";
import SegmentDiagnoses from "./SegmentDiagnoses";

const OccupationalHealthcareSegment: React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => {
  return (
    <Segment padded>
      <h3>{entry.date} <Icon name='hospital outline' /> {entry.employerName}</h3>
      <p><i>{entry.description}</i></p>
      <SegmentDiagnoses codes={entry.diagnosisCodes} />
      {entry.sickLeave ?
        <>
          <h4>Sick leave</h4>
          <p>from {entry.sickLeave.startDate} to {entry.sickLeave.endDate}</p>
        </>
        : null
      }
    </Segment>
  );
};

export default OccupationalHealthcareSegment;