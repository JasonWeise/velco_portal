import type { LoaderArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { json } from "@remix-run/node";

export let handle = {title: "REFERENCE DOCUMENT SECTIONS"}

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  return json({});
};

export default function ReferenceDocsSectionsPage() {
  return (
    <h1>
      REFERENCE DOCUMENT SECTIONS
    </h1>
  );
}