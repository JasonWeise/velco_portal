import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import {
  AppShell,
  createStyles,
  Header,
  Paper,
  ScrollArea,
  Grid,
  Avatar,
  UnstyledButton,
  Menu,
  Container
} from "@mantine/core";
import { Form, Outlet, useMatches } from "@remix-run/react";
import NavMainSidebar from "~/components/navigation/nav-main-sidebar";
import { Logout } from "tabler-icons-react";
import { IconSettings } from '@tabler/icons';


const useStyles = createStyles((theme) => ({
    content: {
        backgroundColor: theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.dark[0],
      margin:0,
      marginBottom: -50,
      marginLeft: 6,
      marginTop: -12,
      padding: 10
    },
  titlePanel: {
    backgroundColor: theme.colorScheme === "dark"
      ? theme.colors.dark[3]
      : theme.colors.dark[8],

  },
  titleText: {
    color: theme.colorScheme === "dark"
      ? theme.colors.dark[8]
      : theme.colors.dark[2],

  }
}));

export const loader = async ({ request }: LoaderArgs) => {
    await requireUserId(request);
    return json({});
};

export default function Index() {

  let matches=useMatches();
  let match = matches.find((match) => {
    return !!match?.handle?.title
  });
  let moduleTitle = match?.handle?.title ?? "";

    const { classes } = useStyles();

    return (
        <AppShell
          navbarOffsetBreakpoint="xs"
          asideOffsetBreakpoint="xs"
            padding="sm"
            navbar={<NavMainSidebar />}
            header={
                <Header height={65} p="xs">
                  <Grid align={"center"}>
                    <Grid.Col span={"content"}>
                  <img src={'/images/logo.webp'} height={35}/>
                    </Grid.Col>
                    <Grid.Col span={"auto"}></Grid.Col>
                    <Grid.Col span={"content"}>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <UnstyledButton><Avatar size={50} radius={"xl"}/></UnstyledButton>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Label>Profile</Menu.Label>
                          <Menu.Item icon={<IconSettings size={14} />}>My Information</Menu.Item>
                          <Menu.Divider />
                          <Menu.Item icon={<Logout size={14} />}>        <Form action="/auth/logout" method="post">
                            <UnstyledButton type={"submit"}>Log Out</UnstyledButton></Form></Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Grid.Col>
                  </Grid>
                </Header>
            }
            styles={(theme) => ({
                main: {
                    backgroundColor:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[9]
                            : theme.colors.dark[1],
                  overflow: "hidden",
                  paddingBottom: 45
                },
            })}
        >
          <>
            <Paper className={classes.titlePanel} shadow="md" p={0} pl={5} ml={8} mt={-25}>
              <h2 className={classes.titleText} >{moduleTitle}</h2>
            </Paper>
            <Paper className={classes.content} style={{ position: "relative", height: "100%"}} >

                <Outlet/>

            </Paper>
          </>
        </AppShell>
    );
}
