import type { LoaderArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { json } from "@remix-run/node";

export let handle = {title: "CREWS"}

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  return json({});
};

export default function CrewsPage() {
  return (
    <h1>
      CREWS
    </h1>
  );
}