import React, { useState } from 'react'
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from "next-urql";
import { Wrapper } from '../components/Wrapper';
import { Form, Formik } from "Formik";
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { InputField } from '../components/InputField';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from "next/link";
import { useForgotPasswordMutation } from '../generated/graphql';

export const ForgotPassword: React.FC<{}> = ({ }) => {
  const [complete, setComplete] = useState(false);
  const router = useRouter();
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", }}
        onSubmit={async (values, { setErrors }) => {
          // console.log(values);
          await forgotPassword({ email: values.email });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) => complete ?
          (<Box>if an account with that email exists, we sent you an email</Box>)
          :
          (
            <Form>
              <InputField
                name="email"
                placeholder="email"
                label="Email"
                type="email"
              />
              <Button isLoading={isSubmitting} type="submit" mt={4} colorScheme="teal">
                Forgot Password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);