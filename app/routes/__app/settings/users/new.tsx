import {
  Box,
  Button,
  Code,
  Drawer,
  Group,
  Paper,
  PasswordInput,
  Progress,
  Stepper,
  Text,
  TextInput
} from "@mantine/core";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import React, { useState } from "react";
import { IconCheck, IconX } from "@tabler/icons";
import { useForm } from "@mantine/form";
import type { ActionFunction} from "@remix-run/node";
import {  redirect } from "@remix-run/node";
import { createUser } from "~/models/user.server";
import { validateNewUser } from "~/validation/validation-user";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string ?? '';
  const password = formData.get("password") as string ?? '';

  try {
    await validateNewUser({email,password});
  } catch (error){
    return error;
  }

  await createUser(email, password);

  return redirect("..");
}

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text
      color={meets ? 'teal' : 'red'}
      sx={{ display: 'flex', alignItems: 'center' }}
      mt={7}
      size="sm"
    >
      {meets ? <IconCheck size={14} /> : <IconX size={14} />} <Box ml={10}>{label}</Box>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password: string) {
  let multiplier = password.length > 7 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

export default function NewUserPage(){
  const navigate = useNavigate()
  const serverValidationErrors = useActionData();

  const [serverValidationState, setServerValidationState] = useState()
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [formReset, setFormReset] = useState(false)
  const [opened,setOpened] = useState(false)
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const formState = useForm({
    initialValues: {
      email: '',
      password: '',
      name: '',
      phone: '',
      website: '',
      github: '',
    },

    validate: (values) => {
      if (active === 0) {
        return {
          email: /^\S+@\S+$/.test(values.email) ? null : 'Invalid email',
          password:
            values.password.length < 6 ? 'Password must include at least 6 characters' : null,
        };
      }

      if (active === 1) {
        return {
          name: values.name.trim().length < 2 ? 'Name must include at least 2 characters' : null,
        };
      }

      return {};
    },
  });

  const strength = getStrength(formState.values.password);
  //const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  React.useEffect(()=>{
    setServerValidationState(serverValidationErrors)
  }, [serverValidationErrors])

  React.useEffect(()=>{
    if(!opened){
      setOpened(true)
      setIsOpen(true)};
  }, [isOpen])

  React.useEffect(()=>{
    if(formReset){
      setActive(0)
      formState.reset()
      setFormReset(false)
    }
  },[formReset])

  const nextStep = () => setActive((current) => { if (formState.validate().hasErrors) { return current; }
      return current < 3 ? current + 1 : current;
    });
  const prevStep = () => {
    setServerValidationState(undefined)  ;
    setActive((current) => (current > 0 ? current - 1 : current))
  };

  const passwordCheckList = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(formState.values.password)} />
  ));

  return(
    <Drawer
      opened={isOpen}
      onClose={() => setIsOpen(false)}
      transitionDuration={500}
      padding="xl"
      size={640}
      position="right"
      overlayOpacity={0.9}
      closeOnEscape={false}
      closeOnClickOutside={false}
      onTransitionEnd={!isOpen ? ()=>navigate(".."):()=>{}}
    >
      <Stepper active={active} breakpoint="sm">
        <Stepper.Step label="First step" description="Profile settings">
          <div>
            <div className="mt-1">
              <TextInput label="Email Address" placeholder="Email Address" {...formState.getInputProps('email')}/>
            </div>
          </div>
          <div className="mt-1">
            <PasswordInput
              mt="md"
              label="Password"
              name="password"
              placeholder="Password"
              onChange={(event) => { formState.setFieldValue("password",event.currentTarget.value )}}
              value={formState.values.password}
              ref={passwordRef}
            />
            <Paper >
              <Progress color={strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red'} value={strength} size={5} style={{ marginBottom: 10 }} />
              <PasswordRequirement label="Includes at least 8 characters" meets={formState.values.password.length > 7} />
              {passwordCheckList}
            </Paper>
          </div>
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Personal information">
          <TextInput label="Name" placeholder="Name" {...formState.getInputProps('name')} />
          <TextInput mt="md" label="Phone Number (optional)" placeholder="Phone Number" {...formState.getInputProps('phone')} />
        </Stepper.Step>
        <Stepper.Step label="Final step" description="Permissions and Roles">
          <TextInput label="Placeholder" placeholder="Placeholder" {...formState.getInputProps('website')} />
          <TextInput
            mt="md"
            label="Placeholder2"
            placeholder="Placeholder2"
            {...formState.getInputProps('github')}
          />
        </Stepper.Step>
        <Stepper.Completed>
          Completed! Form values:
          <Code block mt="xl">
            {JSON.stringify(formState.values, null, 2)}
          </Code>
          {serverValidationState && <ul>
            {Object.values(serverValidationState).map((error) => (<li key={error as string} style={{color:"red"}}>{error as string}</li>))}
          </ul>}
          <Form method={"post"}>
            <input type="hidden" name="email" value={formState.values.email} />
            <input type="hidden" name="password" value={formState.values.password} />
            <Button type={"submit"}  name={"action"} value={"new"}>Create Account</Button>
          </Form>
        </Stepper.Completed>
      </Stepper>
      <Group position="right" mt="xl">
        {active !== 0 && (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}
        {active !== 3 && <Button onClick={nextStep}>Next step</Button>}
      </Group>
    </Drawer>
  )
}

