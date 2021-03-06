import React, { useState } from "react";
import { Formik, Field as _Field, Form as _Form } from "formik";
import styled from "styled-components";
import {
  Box,
  boxy,
  ClearableTextInput,
  TextInput,
  Button,
  Main,
  Title,
} from "../UtilComponents";
import { P } from "../UtilComponents/Typography/Typography";
import { basicCourseForm } from "./formsData";
import * as Yup from "yup";
import {
  fontFamily,
  cieOrange,
  darkGray,
} from "../UtilComponents/sharedStyles";
import ReactGA from "react-ga";

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);

const ApplicationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "Muy corto!")
    .max(50, "Muy largo!")
    .required("Requerido"),
  programmingLevel: Yup.string().required(
    "Favor de seleccionar tu nivel de experiencia con la programación"
  ),
  englishLevel: Yup.string().required(
    "Favor de seleccionar tu nivel de experiencia con el inglés"
  ),
  // whenAttend: Yup.array().required("Favor de seleccionar una opción"),
  whenAttend: Yup.bool().oneOf(
    basicCourseForm.find((field) => field.fieldName === "whenAttend").choices,
    "Por favor elige unas horas"
  ),
  location: Yup.string()
    .min(1, "Muy corto!")
    .required("Favor de decirnos el pais y la ciudad en que resides"),
});

const MultiLabel = styled.label`
  ${boxy}
  font-family: ${fontFamily};
`;
const Field = styled(_Field)`
  ${boxy}
`;
Field.defaultProps = {
  mr: 2,
  mb: 1,
};

const FieldLabel = styled.label`
  ${boxy}
  font-weight: bolder;
  font-family: ${fontFamily};
`;
FieldLabel.defaultProps = {
  mb: 3,
};

const Form = styled(_Form)`
  display: flex;
  flex-direction: column;
`;

const Error = styled(P)`
  color: #ff0033;
`;

const MainAppl = styled(Main)`
  width: min(90%, 700px);
`;

const ClearFieldButton = styled.button`
  border: 1px solid transparent;
  background-color: transparent;
  display: inline-block;
  vertical-align: middle;
  outline: 0;
  cursor: pointer;
  position: relative;
  padding: 10px;
  &:after {
    content: "X";
    display: block;
    width: 15px;
    height: 15px;
    position: absolute;
    background-color: ${cieOrange};
    z-index: 1;
    right: 10px;
    top: -58px;
    bottom: 0;
    margin: auto;
    padding: 2px;
    border-radius: 50%;
    text-align: center;
    color: white;
    font-weight: normal;
    font-size: 12px;
    box-shadow: 0 0 2px #e50f0f;
    cursor: pointer;
  }
`;

export const BasicCourseForm = ({ appStore, cieApi }) => {
  const [appComplete, setAppComplete] = useState(false);
  const initialValues = {};
  basicCourseForm.forEach((field) => {
    initialValues[field.fieldName] = field.initialValue
      ? field.initialValue
      : "";
  });
  initialValues["location"] = appStore.userLocation || "";
  initialValues["fullName"] = appStore.lastName
    ? appStore.firstName + " " + appStore.lastName
    : appStore.firstName;

  return (
    <>
      <Title textAlign="center">Solicita una plaza</Title>
      <P mb={4} textAlign="center">
        <i>del 20 septiembre al 20 diciembre</i>
      </P>
      {appComplete ? (
        <P>
          Gracias por completar la solicitud! Te contactaremos dentro de 2 días
          para hablar de los próximos pasos.
        </P>
      ) : (
        <>
          <Formik
            validationSchema={ApplicationSchema}
            initialValues={initialValues}
            onSubmit={async (values, actions) => {
              values.email = appStore.email;
              await cieApi.submitApp(values);
              setAppComplete(true);
              actions.setSubmitting(false);
              appStore.userApplied = true;
            }}
          >
            {({
              values,
              errors,
              touched,
              handleSubmit,
              handleChange,
              handleBlur,
              isSubmitting,
              setFieldValue,
            }) => (
              <Form onSubmit={handleSubmit}>
                {basicCourseForm.map((field, idx) => {
                  const { fieldName } = field;
                  let fieldJsx;

                  if (field.fieldType === "shortAnswer") {
                    fieldJsx = (
                      <>
                        <FieldLabel htmlFor={field.title} key={idx}>
                          {field.title}
                        </FieldLabel>
                        <TextInput
                          autocomplete="false"
                          type="text"
                          id={fieldName}
                          name={fieldName}
                          onFocus={() => {
                            ReactGA.event({
                              category: "applyFieldFocus",
                              action: `user focused field ${field.title}`,
                            });
                          }}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          value={values[field.fieldName]}
                        />
                      </>
                    );
                  }
                  if (field.fieldType === "email") {
                    fieldJsx = (
                      <>
                        <FieldLabel htmlFor={field.title} key={idx}>
                          {field.title}
                        </FieldLabel>
                        <TextInput
                          type="email"
                          id={fieldName}
                          name={fieldName}
                          onFocus={() => {
                            ReactGA.event({
                              category: "applyFieldFocus",
                              action: `user focused field ${field.title}`,
                            });
                          }}
                          onChange={handleChange}
                          value={values[fieldName]}
                        />
                      </>
                    );
                  }
                  if (field.fieldType === "multipleChoice") {
                    fieldJsx = (
                      <>
                        <FieldLabel htmlFor={field.title} key={idx}>
                          {field.title}
                        </FieldLabel>
                        {field.choices.map((choice, idx) => {
                          return (
                            <MultiLabel key={idx}>
                              <Field
                                type="radio"
                                name={fieldName}
                                value={choice}
                              />
                              {choice}
                            </MultiLabel>
                          );
                        })}
                      </>
                    );
                  }
                  if (field.fieldType === "checkboxes") {
                    fieldJsx = (
                      <>
                        <FieldLabel htmlFor={field.title}>
                          {field.title}
                        </FieldLabel>
                        {field.choices.map((choice, idx) => {
                          return (
                            <MultiLabel key={idx}>
                              <Field type="checkbox" name={choice} />
                              {choice}
                            </MultiLabel>
                          );
                        })}
                      </>
                    );
                  }
                  if (field.fieldType === "paragraph") {
                    fieldJsx = (
                      <>
                        <FieldLabel htmlFor={field.title} key={idx}>
                          {field.title}
                        </FieldLabel>
                        <TextInput
                          as="textarea"
                          name={fieldName}
                          value={values[field.fieldName]}
                          onFocus={() => {
                            ReactGA.event({
                              category: "applyFieldFocus",
                              action: `user focused field ${field.title}`,
                            });
                          }}
                          onChange={handleChange}
                          value={values[fieldName]}
                        />
                      </>
                    );
                  }
                  return (
                    <Box display="flex" flexDirection="column" mb={3}>
                      {fieldJsx}
                      {errors[fieldName] && <Error>{errors[fieldName]}</Error>}
                    </Box>
                  );
                })}
                <>
                  <FieldLabel htmlFor={"location"}>
                    Ciudad y país. (Lo necesitamos para saber tu zona horaria)
                  </FieldLabel>
                  <ClearableTextInput
                    id={"location"}
                    name={"location"}
                    onFocus={() => {
                      ReactGA.event({
                        category: "applyFieldFocus",
                        action: `user focused field location`,
                      });
                    }}
                    onChange={(e) => {
                      console.log(e);
                      handleChange(e);
                    }}
                    value={values["location"] || appStore.userLocation}
                    onClear={() => {
                      setFieldValue("location", " ", false);
                    }}
                  />

                  {errors["location"] ? (
                    <Error>{errors["location"]}</Error>
                  ) : (
                    <div style={{ color: "white" }}>empty</div>
                  )}
                </>
                <Button
                  display="flex"
                  alignItems="center"
                  type="submit"
                  onClick={() => {
                    ReactGA.event({
                      category: "appliedCat",
                      action: `userApplied`,
                    });
                  }}
                >
                  Envía mi solicitud
                </Button>
              </Form>
            )}
          </Formik>
        </>
      )}
    </>
  );
};
