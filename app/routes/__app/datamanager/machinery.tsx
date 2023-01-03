import type { LoaderArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { json } from "@remix-run/node";

export let handle = {title: "PLANT & MACHINERY"}

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  return json({});
};

export default function MachineryPage() {
  return (
    <h1>
      PLANT & MACHINERY
    </h1>
  );
}