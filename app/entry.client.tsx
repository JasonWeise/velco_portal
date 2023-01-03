import { RemixBrowser } from "@remix-run/react";
import { ClientProvider } from "@mantine/remix";

import { hydrateRoot } from "react-dom/client";
import {startTransition, StrictMode} from "react";

const hydrate = () => {
    startTransition(() => {
        hydrateRoot(
            document,

                <ClientProvider>
                <RemixBrowser />
                </ClientProvider>

        );
    });
};

if (window.requestIdleCallback) {
    window.requestIdleCallback(hydrate);
} else {
    // Safari doesn't support requestIdleCallback
    // https://caniuse.com/requestidlecallback
    window.setTimeout(hydrate, 1);
}