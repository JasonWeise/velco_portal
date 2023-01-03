import {
    Button, Center,
    createStyles, Drawer,
    Navbar, Paper, Popover, Text, Title,
    Tooltip,
    UnstyledButton,
    useMantineTheme
} from "@mantine/core";
import type { TablerIcon
} from "@tabler/icons";
import {
    IconCalendarStats,
    IconDeviceDesktopAnalytics,
    IconFingerprint,
    IconGauge,
    IconHome2,
    IconSettings,
    IconUser
} from "@tabler/icons";
import { Link, Location, NavLink, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import * as crypto from "crypto";
const ToolTipLabel = ({label}:{label:string}) =>{ return(<Center style={{height:30}} >{label}</Center>)}

type FeatureLink = {name: string, url: string};
type NavLinkDataRecord = {pos:number, icon: TablerIcon, label: any, mainUrl: string, features: Array<FeatureLink>}
type NavLinkData = Array<NavLinkDataRecord>;

const mainLinksMockdata: NavLinkData = [
    { pos:1,icon: IconHome2, label: <ToolTipLabel label="Home"/>,mainUrl: "/",features:[] },
    { pos:2,icon: IconDeviceDesktopAnalytics, label: <ToolTipLabel label="DB Engine"/>,mainUrl: "",features:[{name:"Databases", url:"dbengine"},{name:"Open Issues",url:"dashboard"}] },
    { pos:3,icon: IconGauge, label: <ToolTipLabel label="Dashboard"/>,mainUrl: "",features:[{name:"Databases2", url:"placeholder7"},{name:"Open Issues2",url:"placeholder2"}] },
    { pos:4,icon: IconCalendarStats, label: <ToolTipLabel label="Releases"/>,mainUrl: "",features:[{name:"Databases2", url:"placeholder8"},{name:"Open Issues3",url:"placeholder3"}] },
    { pos:5,icon: IconUser, label: <ToolTipLabel label="Notes"/>,mainUrl: "",features:[{name:"Notes", url:"notes"},{name:"Open Issues4",url:"placeholder4"}] },
    { pos:6,icon: IconFingerprint, label: <ToolTipLabel label="Security"/>,mainUrl: "",features:[{name:"Databases3", url:"placeholder9"},{name:"Open Issues5",url:"placeholder5"}] },
    { pos:7,icon: IconSettings, label: <ToolTipLabel label="Settings"/> ,mainUrl: "", features:[{name:"Users", url:"settings/users"},{name:"Open Issues6",url:"placeholder6"}] },
];

export default function NavMainSidebar() {
    const theme = useMantineTheme();
    const { classes, cx } = useStyles();
    const [opened, setOpened] = useState(false);
    const [currentFeature, setCurrentFeature] = useState("");
    const [potentialModule, setPotentialModule] = useState("");
    const [currentModule, setCurrentModule] = useState("");

    useEffect(()=>{
        const f = window.sessionStorage.getItem("selectedFeature");
        const m = window.sessionStorage.getItem("selectedModule");
        setCurrentFeature((f ?? ""));
        setCurrentModule((m ?? ""));
    },[])

    useEffect(()=>{
        window.sessionStorage.setItem("selectedFeature", currentFeature);
        window.sessionStorage.setItem("selectedModule", currentModule);
    },[currentFeature,currentModule])

    // NOTE: CHANGE THE WORD "POTENTIAL" TO "INTENDED" IN ALL CODE IN THIS COMPONENT

    let MasterLink = (link:NavLinkDataRecord) => {
        const [opened, { close, open }] = useDisclosure(false);
        return(
            <Popover
                opened={opened}
                shadow="md"
                position="right"
                withArrow
                transitionDuration={150}
                key={link.pos}
                arrowSize={10}
                width={180}
            >
                <Popover.Target>
                <Link
                    to={link.mainUrl}
                    onClick={() => {
                        setCurrentModule(link.label);
                        setPotentialModule(link.label);
                        close();
                        setOpened(!opened);

                    }}
                    className={cx(classes.mainLink, {
                        [classes.mainLinkActive]: link.label === currentModule ?? "",
                    })}
                    onMouseEnter={open} onMouseLeave={close}
                >
                    <link.icon stroke={1.5} />
                </Link>
                </Popover.Target>
                <Popover.Dropdown sx={{ pointerEvents: 'none' }} bg={
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[7]
                      : theme.colors.gray[0]
                }>
                    {link.label}
                </Popover.Dropdown>
            </Popover>
        )
    }

    let PrimaryLink = (link:NavLinkDataRecord) => {
        const [popOverOpened, { close, open }] = useDisclosure(false);
        return(
            <Popover
              opened={popOverOpened}
              shadow="md"
              position="right"
              withArrow
              transitionDuration={150}
              key={link.pos+link.label}
              arrowSize={10}
              width={180}
            >
                <Popover.Target>
                <UnstyledButton
                    onClick={() => {
                        setPotentialModule(link.label)
                        close();
                        setOpened(!opened);
                    }}
                    className={cx(classes.mainLink, {
                        [classes.mainLinkSelected]: link.label === potentialModule ?? "",
                        [classes.mainLinkActive]: link.label === currentModule ?? "",
                    })}
                    onMouseEnter={open} onMouseLeave={close}
                >
                    <link.icon stroke={1.5} />
                </UnstyledButton>
                </Popover.Target>
                <Popover.Dropdown sx={{ pointerEvents: 'none' }} bg={
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[7]
                      : theme.colors.gray[0]
                }>
                    {link.label}
                </Popover.Dropdown>
            </Popover>
        )
    }

    return (
        <Navbar hiddenBreakpoint="xs" width={{ xs: 50 }} hidden={true}>
            <Navbar.Section grow className={classes.wrapper}>
                <div className={classes.aside}>
                    <div className={classes.logo}></div>
                    { mainLinksMockdata.map((link) => (
                        link.features.length===0? MasterLink(link):PrimaryLink(link)
                    ))
                    }
                </div>
                <Drawer
                    opened={opened}
                    onClose={() => { setOpened(false); setPotentialModule("")}}
                    title="Register"
                    padding="xl"
                    size="250px"
                    overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                    overlayOpacity={0.55}
                    overlayBlur={3}
                    styles={(theme) => ({
                        root:{
                            margin:"*",
                            zIndex: 50,
                            paddingRight:"0 !important",
                        },
                        drawer: {
                            paddingRight:"0 !important",
                            marginLeft: 50,
                        },
                    })}
                >
                    <Title order={4} className={classes.title}>
                        {potentialModule}
                    </Title>
                    { mainLinksMockdata.find(l => l.label === potentialModule)?.features.map((link) => (
                        <NavLink
                            className={cx(classes.navLink)}

                            onClick={(event) => {
                                setCurrentFeature(link.name)
                                setCurrentModule(potentialModule);
                                setOpened(false);
                            }}
                            key={link.name}
                            to={link.url}
                        >
                            {link.name}
                        </NavLink>
                    ))
                    }
                </Drawer>
            </Navbar.Section>
        </Navbar>
    );
}
const useStyles = createStyles((theme) => ({
    wrapper: {
        display: "flex",
    },

    aside: {
        flex: "0 0 60px",
        backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRight: `1px solid ${
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
        }`,
    },

    main: {
        flex: 1,
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
    },

    mainLinkTooltip: {
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[7],
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.dark[1]
                : theme.colors.gray[0],
    },

    mainLink: {
        width: 44,
        height: 44,
        borderRadius: theme.radius.md,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[7],

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[5]
                    : theme.colors.gray[0],
        },
    },

    mainLinkActive: {
        "&, &:hover": {
            backgroundColor: theme.fn.variant({
                variant: "light",
                color: theme.primaryColor,
            }).background,
            color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
                .color,
        },
    },

    mainLinkSelected: {

        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[0],

    },

    title: {
        boxSizing: "border-box",
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        marginBottom: theme.spacing.xl,
        backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        padding: theme.spacing.md,
        paddingTop: 18,
        height: 60,
        borderBottom: `1px solid ${
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
        }`,
    },

    logo: {
        boxSizing: "border-box",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        height: 60,
        paddingTop: theme.spacing.md,
        borderBottom: `1px solid ${
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
        }`,
        marginBottom: theme.spacing.xl,
    },

    navLink: {
        boxSizing: "border-box",
        display: "block",
        textDecoration: "none",
        borderTopRightRadius: theme.radius.md,
        borderBottomRightRadius: theme.radius.md,
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[7],
        padding: `0 ${theme.spacing.sm}px`,
        fontSize: theme.fontSizes.sm,
        marginRight: theme.spacing.sm,
        fontWeight: 500,
        height: 44,
        lineHeight: "44px",

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[5]
                    : theme.colors.gray[1],
            color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
    },

    linkActive: {
        "&, &:hover": {
            borderLeftColor: theme.fn.variant({
                variant: "filled",
                color: theme.primaryColor,
            }).background,
            backgroundColor: theme.fn.variant({
                variant: "filled",
                color: theme.primaryColor,
            }).background,
            color: theme.white,
        },
    },
}));