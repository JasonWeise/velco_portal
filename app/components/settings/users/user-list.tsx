import { useState } from "react";
import { createStyles, Table, ScrollArea, Button } from "@mantine/core";
import type { User } from "@prisma/client";
import { Form } from "@remix-run/react";

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    zIndex: 10,
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`
    }
  },

  scrolled: {
    boxShadow: theme.shadows.sm
  }
}));

interface TableScrollAreaProps {
  data: User[];
}

export function UserList({ data }: TableScrollAreaProps) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const rows = data.map((user) => (
    <tr key={user.email}>
      <td>{user.email}</td>
      <td>
        <Form method={"post"}>
          <input type={"hidden"} name={"id"} value={user.id}/>
          <Button type={"submit"}  color="blue" radius="sm" size="sm" compact m={5} name={"action"} value={"edit"}>
            Edit
          </Button>
          <Button type={"submit"} color="red" radius="sm" size="sm" compact m={5} name={"action"} value={"delete"}>
            Delete
          </Button>
        </Form>
      </td>
    </tr>
  ));

  return (
    <ScrollArea
      sx={{ height: `calc(100vh - 180px)` }}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table sx={{ minWidth: 700 }} striped>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
        <tr>
          <th>Email</th>
          <th style={{width:150}}>Actions</th>
        </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
