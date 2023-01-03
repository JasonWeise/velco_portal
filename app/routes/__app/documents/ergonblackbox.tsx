import type { LoaderArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { json } from "@remix-run/node";

export let handle = {title: "ERGON BLACKBOX"}

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  return json({});
};

export default function ErgonBlackboxPage() {
  return (
    <h1>
      ERGON BLACKBOX
    </h1>
  );
}