import React from "react";
import { Icon, Segment } from "semantic-ui-react";
import { HospitalEntry } from "../types";
import SegmentDiagnoses from "./SegmentDiagnoses";

const HospitalSegment: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  return (
    <Segment padded>
      <h3>{entry.date} <Icon name='hospital' /></h3>
      <p><i>{entry.description}</i></p>
      <SegmentDiagnoses codes={entry.diagnosisCodes} />
      <h4>Discharged {entry.discharge.date}</h4>
      <p>{entry.discharge.criteria}</p>
    </Segment>
  );
};

export default HospitalSegment;