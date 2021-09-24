import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { TextField, NumberField, DiagnosisSelection } from "../AddPatientModal/FormField";
import { HealthCheckEntry } from "../types";
import { useStateValue } from "../state";

/*
 * use type Entry, but omit id,
 * because those are irrelevant for new patient entry object.
 */
export type EntryHealthCheckFormValues = Omit<HealthCheckEntry, "id">;

interface Props {
  onSubmit: (values: EntryHealthCheckFormValues) => void;
  onCancel: () => void;
}

export const AddHealthCheckEntryForm = ({ onSubmit, onCancel } : Props ) => {
  const [{ diagnoses }] = useStateValue();
  
  return (
    <Formik
      initialValues={{
        type: "HealthCheck",
        description: "",
        date: "",
        specialist: "",
        healthCheckRating: 0,
        diagnosisCodes: []
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const healthCheckError = "Rating must be 0, 1, 2 or 3";
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
        if (!(values.healthCheckRating === 0
           || values.healthCheckRating === 1
           || values.healthCheckRating === 2
           || values.healthCheckRating === 3)) {
          errors.healthCheckRating = healthCheckError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <Field
              label="Type"
              placeholder="HealthCheck"
              name="type"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
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
            /><Field
              label="Health rating"
              name="healthCheckRating"
              component={NumberField}
              min={0}
              max={3}
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

export default AddHealthCheckEntryForm;
