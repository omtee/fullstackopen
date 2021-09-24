import React from "react";
import { useStateValue } from "../state";
import { Diagnosis } from "../types";

const SegmentDiagnoses: React.FC<{ codes: Array<Diagnosis['code']> | undefined }> = ({ codes }) => {
  const [{ diagnoses }] = useStateValue();

  if (!codes) {
    return null;
  }

  return (
    <ul>
      {codes?.map(diagnosisCode => {
        const diagnosis = diagnoses[diagnosisCode];
        if (diagnosis) {
          return <li>{diagnosis.code} {diagnosis.name}</li>;
        } else {
          return <li>Could not find {diagnosisCode}</li>;
        }
      })}
    </ul>
  );
};

export default SegmentDiagnoses;