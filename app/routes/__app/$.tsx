import type { LoaderArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { json } from "@remix-run/node";

export let handle = {title: "ERROR - FEATURE NOT AVAILABLE"}

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  return json({});
};

export default function AppSplatPage() {
    return (
        <h1>
            Sorry, This feature doesn't appear to be available!
        </h1>
    );
}