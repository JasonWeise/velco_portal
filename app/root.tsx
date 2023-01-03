import type {LoaderArgs, MetaFunction} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import {createEmotionCache, createStyles, MantineProvider} from "@mantine/core";
import { StylesPlaceholder } from "@mantine/remix";
import { theme } from "./theme";
import { getUser } from "./session.server";
import {json} from "@remix-run/node";
import type { User } from "@prisma/client";

export type AppState = {user: User | null, module: String}

export type LoaderData = { appState: AppState };

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Portal",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json<LoaderData>({appState:{
    user: await getUser(request), module:""
  }});
}

createEmotionCache({ key: "mantine" });

export default function App() {

  //useStyles()
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <html lang="en">
        <head>
          <StylesPlaceholder />
          <Meta />
          <Links />
        </head>
        <body style={{ height: "100vh"}} >
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </MantineProvider>
  );
}
