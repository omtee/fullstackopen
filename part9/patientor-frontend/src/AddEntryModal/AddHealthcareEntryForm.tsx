import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { TextField, DiagnosisSelection } from "../AddPatientModal/FormField";
import { OccupationalHealthcareEntry } from "../types";
import { useStateValue } from "../state";

/*
 * use type Entry, but omit id,
 * because those are irrelevant for new patient entry object.
 */
export type EntryHealthcareFormValues = Omit<OccupationalHealthcareEntry, "id">;

interface Props {
  onSubmit: (values: EntryHealthcareFormValues) => void;
  onCancel: () => void;
}

export const AddHealthcareEntryForm = ({ onSubmit, onCancel } : Props ) => {
  const [{ diagnoses }] = useStateValue();
  
  return (
    <Formik
      initialValues={{
        type: "OccupationalHealthcare",
        description: "",
        date: "",
        specialist: "",
        employerName: "",
        sickLeave: {
          startDate: "",
          endDate: ""
        },
        diagnosisCodes: []
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.type || values.type.length < 2) {
          errors.type = requiredError;
        }
        if (!values.description || values.description.length < 2) {
          errors.description = requiredError;
        }
        if (!values.date || values.date.length < 2) {
          errors.date = requiredError;
        }
        if (!values.specialist || values.specialist.length < 2) {
          errors.specialist = requiredError;
        }
        if (!values.employerName || values.employerName.length < 2) {
          errors.employerName = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <Field
              label="Type"
              placeholder="OccupationalHealthcare"
              name="type"
              component={TextField}
              disabled={true}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Employer name"
              placeholder="Employer name"
              name="employerName"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="MD House"
              name="specialist"
              component={TextField}
            />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Sick leave start date"
              placeholder="YYYY-MM-DD"
              name="sickLeave.startDate"
              component={TextField}
            />
            <Field
              label="Sick leave end date"
              placeholder="YYYY-MM-DD"
              name="sickLeave.endDate"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />  
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddHealthcareEntryForm;
