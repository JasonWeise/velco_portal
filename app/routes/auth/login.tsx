import type { ActionFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams, useTransition } from "@remix-run/react";
import * as React from "react";
import { createUserSession, getUserId } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";
import {
    Paper,
    createStyles,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Title,
    Text,
    Anchor,
} from '@mantine/core';
import { useRef, useState } from "react";


export const loader = async ({ request }: LoaderArgs) => {
    const userId = await getUserId(request);
    if (userId) return redirect("/");
    return json({});
};

interface ActionData {
    errors?: {
        email?: string;
        password?: string;
        other?: string;
    };
}

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
    const remember = formData.get("remember");

    console.log("Email:"+email)
    console.log("Password:"+password)

    if (!validateEmail(email)) {
        return json<ActionData>(
            { errors: { email: "Email is invalid" } },
            { status: 400 }
        );
    }

    if (typeof password !== "string") {
        return json<ActionData>(
            { errors: { password: "Password is required" } },
            { status: 400 }
        );
    }

    if (password.length < 8) {
        return json<ActionData>(
            { errors: { password: "Password is too short" } },
            { status: 400 }
        );
    }

    try {
        const user = await verifyLogin(email, password);

        if (!user) {
            return json<ActionData>(
                { errors: { email: "Invalid email or password" } },
                { status: 400 }
            );
        }

        return createUserSession({
            request,
            userId: user.id,
            remember: remember === "on",
            redirectTo,
        });
    }catch (e){
        console.log(e)
        return json<ActionData>(
            { errors: { other: "There has been a system error on our end.\nPlease wait 5 minutes and try again." } },
            { status: 400 }
        );
    }
};

export const meta: MetaFunction = () => {
    return {
        title: "Login",
    };
};

const useStyles = createStyles((theme) => ({
    wrapper: {
        height: '100%',
        minHeight: 900,
        backgroundSize: 'cover',
        backgroundImage:
            'url(/images/bg_login.jpg)',
    },

    form: {
        borderRight: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
        }`,
        height: '100%',
        minHeight: 900,
        maxWidth: 450,
        paddingTop: 80,

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            maxWidth: '100%',
        },
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },

    logo: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        width: 120,
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
    },

    error: {
        color: theme.colorScheme === 'dark' ? theme.colors.red : theme.colors.red,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        whiteSpace: "pre"
    },

    delayed: {
        color: theme.colorScheme === 'dark' ? theme.colors.yellow : theme.colors.yellow,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        whiteSpace: "pre"
    },
}));
type Timer = ReturnType<typeof setTimeout>

export default function LoginPage() {
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/";
    const actionData = useActionData() as ActionData;
    const emailRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);
    const transition = useTransition();
    const [isLoginDelayed, setIsLoginDelayed] = useState(false)
    const [ seconds, setSeconds] = useState(4);

    const  timer: React.MutableRefObject<Timer | undefined> = useRef();

    React.useEffect(() => {
        if (actionData?.errors?.email) {
            emailRef.current?.focus();
        } else if (actionData?.errors?.password) {
            passwordRef.current?.focus();
        }

        if(transition.state === "submitting"){
            startTimer()
        }else{
            setIsLoginDelayed(false);
            resetTimer();
        }



    }, [actionData, transition]);

    React.useEffect(() => {
        if (seconds === 0) {
            resetTimer();
            setIsLoginDelayed(true);
        }
    },[seconds])


    const { classes } = useStyles();

    const startTimer = () => {
        if(actionData?.errors?.other) {
            actionData.errors.other  = undefined;
        }
        timer.current = setInterval(() => {
            setSeconds(prevState => prevState - 1)
        }, 1000);
    };

    const resetTimer = () => {
        clearInterval(timer.current);
        timer.current = undefined;
        setSeconds(4);

    };

    return (
        <div className={classes.wrapper}>
            <Form method="post" style={{height:'100%'}}>
                <Paper className={classes.form} radius={0} p={30}>
                    <Title order={2} className={classes.title} align="center" mt="md" mb={50}>
                        Welcome to the Velco Portal!
                    </Title>

                    <TextInput label="Email address" placeholder="hello@gmail.com" size="md"               ref={emailRef}
                               id="email"
                               required
                               autoFocus={true}
                               name="email"
                               type="email"
                               autoComplete="email"
                               aria-invalid={actionData?.errors?.email ? true : undefined}
                               aria-describedby="email-error"/>
                    <PasswordInput label="Password" placeholder="Your password" mt="md" size="md"                 id="password"
                                   ref={passwordRef}
                                   name="password"
                                   type="password"
                                   autoComplete="current-password"
                                   aria-invalid={actionData?.errors?.password ? true : undefined}
                                   aria-describedby="password-error" />
                    <Checkbox label="Keep me logged in" mt="xl" size="md" />
                    <input type="hidden" name="redirectTo" value={redirectTo} />

                    <Button type={"submit"} fullWidth mt="xl" size="md" disabled={transition.state === "submitting"}>
                        {transition.state === "submitting"
                            ? "Logging In..."
                            : "Login"}
                    </Button>

                    {/* ***** REMOVE REGISTER OPTION ********
                        <Text align="center" mt="md">
                            Don&apos;t have an account?{' '}
                            <Anchor<'a'> href="#" weight={700} onClick={(event) => event.preventDefault()}>
                                Register
                            </Anchor>
                        </Text>
                    */}

                    {actionData?.errors?.other ?
                        <Text align="center" mt="md" className={classes.error}>
                            {actionData?.errors?.other}
                        </Text>
                        : <>
                        </>
                    }
                    {
                        isLoginDelayed ?
                            <Text align="center" mt="md" className={classes.delayed}>
                                Login taking longer than usual, please wait....
                            </Text> : <></>
                    }
                </Paper>
            </Form>
        </div>
    )
}
