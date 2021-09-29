import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import { assertNever } from '../utils';
import AddHealthcareEntryForm, { EntryHealthcareFormValues } from './AddHealthcareEntryForm';
import AddHealthCheckEntryForm, { EntryHealthCheckFormValues } from './AddHealthCheckEntryForm';
import AddHospitalEntryForm, { EntryHospitalFormValues } from './AddHospitalEntryForm';

export type EntryFormValues = EntryHealthCheckFormValues | EntryHospitalFormValues | EntryHealthcareFormValues;

interface Props {
  entryType: EntryFormValues['type'];
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryFormValues) => void;
  error?: string;
}

export const AddEntryModal = ({ entryType, modalOpen, onClose, onSubmit, error }: Props) => {
  const EntryForm: React.FC<{ entryType: EntryFormValues['type'] }>  = ({ entryType }) => {
    switch (entryType) {
      case "HealthCheck":
        return <AddHealthCheckEntryForm onSubmit={onSubmit} onCancel={onClose} />;
      case "Hospital":
        return <AddHospitalEntryForm onSubmit={onSubmit} onCancel={onClose} />;
      case "OccupationalHealthcare":
        return <AddHealthcareEntryForm onSubmit={onSubmit} onCancel={onClose} />;
      default:
        return assertNever(entryType);
    }
  };
  
  return (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>Add a new Health Check entry</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <EntryForm entryType={entryType} />
    </Modal.Content>
  </Modal>
  );
};