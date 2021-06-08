import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { NextPage } from 'next';
import React, { useState } from 'react'
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { toErrorMap } from '../../utils/toErrorMap';
import { Form, Formik } from "Formik";
import { useChangePasswordMutation } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import NextLink from "next/link";

export const ChangePassword: NextPage = () => {
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const [ tokenError, setTokenError ] = useState('');
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const res = await changePassword({
            newPassword: values.newPassword,
            token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
          })
          if (res.data?.changePassword.errors) {
            const errorMap = toErrorMap(res.data.changePassword.errors);
            if('token' in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          }
          else if (res.data?.changePassword.user) {
            // server auto log in the user and redirect to index
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            />
            {tokenError ? 
            <Flex>
              <Box mr={2} color="red">{tokenError}</Box>
              <NextLink href="/forgot-password">
                <Link>Click here to get a new one</Link>
              </NextLink>
            </Flex>
            : null}
            <Button isLoading={isSubmitting} type="submit" mt={4} colorScheme="teal">
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

// ChangePassword.getInitialProps = ({ query }) => {
//   return {
//     token: query.token as string
//   };
// }

export default withUrqlClient(createUrqlClient)(ChangePassword);