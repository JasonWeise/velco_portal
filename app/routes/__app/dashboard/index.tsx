import { Container, createStyles, ScrollArea, Stack } from "@mantine/core";
import { useLoaderData, useMatches } from "@remix-run/react";
import type { User } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getUser, requireUserId } from "~/session.server";
import type { LoaderData } from "~/root";
import { useState } from "react";

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

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  return json({});
};

export let handle = {title: "Dashboard"}

export default function DashboardPage() {
  //const { classes, cx } = useStyles();
  //useStyles();
  const [scrolled, setScrolled] = useState(false);

  return (

    <ScrollArea
      sx={{ height: `calc(100vh - 180px)` }}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
        <h1>Default container Start</h1>
        <h1>Default container</h1>
        <h1>Default container</h1>
        <h1>Default container</h1>
        <h1>Default container</h1>
        <h1>Default container</h1>
        <h1>Default container</h1>
        <h1>Default container</h1>
        <h1>Default container</h1>
        <h1>Default container</h1>
        <h1>Default container</h1>
        <h1>Default container</h1>
        <h1>Default container</h1>
        <h1>Default container</h1>
        <h1>Default container</h1>
        <h1>Default container</h1>
        <h1>Default container</h1>
        <h1>Default container End</h1>
    </ScrollArea>

  );
}