import type { LoaderArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { json } from "@remix-run/node";

export let handle = {title: "CREW MANUAL"}

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  return json({});
};

export default function CrewManualPage() {
  return (
    <h1>
      CREW MANUAL
    </h1>
  );
}