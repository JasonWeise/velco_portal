import type { LoaderArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { json } from "@remix-run/node";

export let handle = {title: "SAFETY MESSAGE"}

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  return json({});
};

export default function SafetyMessagePage() {
  return (
    <h1>
      SAFETY MESSAGE
    </h1>
  );
}