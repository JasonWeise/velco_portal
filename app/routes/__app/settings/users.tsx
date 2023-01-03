import {
  Box,
  Button, Code, Container,
  Drawer,
  Group, Paper, PasswordInput, Progress,
  Stepper,
  Text,
  TextInput
} from "@mantine/core";
import {
  Form, Link, Outlet,
  useActionData,
  useLoaderData, useNavigate
} from "@remix-run/react";
import type { LoaderArgs, MetaFunction , ActionFunction} from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { createUser, getUserByEmail, getUserListItems } from "~/models/user.server";
import React, { useState } from "react";
import { validateEmail } from "~/utils";
import { UserList } from "~/components/settings/users/user-list";
import type { User } from "@prisma/client";

export let handle = {title: "User Management"}
export const meta: MetaFunction = () => {
  return {
    title: "User Management",
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  const userListItems : User[] = await getUserListItems();
  return userListItems;// json({ userListItems });
}


export default function Users() {
  const navigate = useNavigate()

  const userList = useLoaderData();

  const [isNewUserDrawOpened, setIsNewUserDrawOpened] = useState(false);

  return (
    <div className="flex min-h-full flex-col justify-center">
      {/* <NewUserDraw isOpen={isNewUserDrawOpened} setIsOpen={setIsNewUserDrawOpened}/> */}
      <Container>
      <Outlet/>
      </Container>
      <Group position="left">
        <Button onClick={() => navigate('new')}>Add User</Button>
      </Group>
      <UserList data={userList} />
    </div>
  );
}
