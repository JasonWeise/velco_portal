import { Container, createStyles, ScrollArea, Stack } from "@mantine/core";
import { useLoaderData } from "@remix-run/react";
import DashboardPage from "~/routes/__app/dashboard";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUserId } from "~/session.server";

export let handle = {title: "HOME"}

export const loader = async ({ request }: LoaderArgs) => {
    await requireUserId(request);
    return json({});
};

const useStyles = createStyles(() => ({
    root: {
        border: "1px solid black",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    body: {
        border: "1px solid black",
        width: "100%",
        flexGrow: 1,
    },
}));

export default function IndexPage() {
    //const { classes, cx } = useStyles();
    //useStyles();
    return (

     <DashboardPage/>

    );
}