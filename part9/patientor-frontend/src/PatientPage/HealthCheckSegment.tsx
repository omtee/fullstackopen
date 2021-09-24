import React from "react";
import { Icon, Segment } from "semantic-ui-react";
import { HealthCheckEntry, HealthCheckRating } from "../types";
import { assertNever } from "../utils";
import SegmentDiagnoses from "./SegmentDiagnoses";

const HealthCheckSegment: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {

  const RatingIcon: React.FC<{ rating: HealthCheckRating }> = ({ rating }) => {
    const iconName = 'heart';
    switch (rating) {
      case HealthCheckRating.Healthy:
        return <Icon color='green' name={iconName} />;
      case HealthCheckRating.LowRisk:
        return <Icon color='yellow' name={iconName} />;
      case HealthCheckRating.HighRisk:
        return <Icon color='orange' name={iconName} />;
      case HealthCheckRating.CriticalRisk:
        return <Icon color='red' name={iconName} />;
      default:
        return assertNever(rating);
    }
  };

  return (
    <Segment padded>
      <h3>{entry.date} <Icon name='user md' /></h3>
      <p><i>{entry.description}</i></p>
      <RatingIcon rating={entry.healthCheckRating} />
      <SegmentDiagnoses codes={entry.diagnosisCodes} />
    </Segment>
  );
};

export default HealthCheckSegment;