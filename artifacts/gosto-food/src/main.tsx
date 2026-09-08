import { createRoot } from "react-dom/client";

const root = document.getElementById("root")!;
const basePath = import.meta.env.BASE_URL;
const normalizedBasePath = basePath.replace(/\/+$/, "") || "/";
const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
const path =
  normalizedBasePath !== "/" && pathname.startsWith(normalizedBasePath)
    ? pathname.slice(normalizedBasePath.length).replace(/\/+$/, "") || "/"
    : pathname;

type PublishedMenuItem = {
  name: string;
  price?: number | null;
  sizes?: Array<{ price: number }>;
};

type PublishedMenu = {
  categories: Array<{ items: PublishedMenuItem[] }>;
};

function syncPublishedOpeningHours() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let currentNode = walker.nextNode();

  while (currentNode) {
    textNodes.push(currentNode as Text);
    currentNode = walker.nextNode();
  }

  for (const node of textNodes) {
    const value = node.nodeValue ?? "";
    if (value.includes("Sam — Jeu") && value.includes("15:00")) {
      node.nodeValue = "Sam — Jeu : 10:00 – 22:00";
      node.parentElement?.querySelector("br")?.remove();
    } else if (/^\s*\/\s*17:00\s*–\s*22:00\s*$/.test(value)) {
      node.nodeValue = "";
    }
  }
}

function syncPublishedMenuPrices(menu: PublishedMenu) {
  const menuRoot = document.getElementById("menu");
  if (!menuRoot) return;

  const cards = Array.from(menuRoot.querySelectorAll<HTMLElement>("div.sharp"));
  for (const item of menu.categories.flatMap((category) => category.items)) {
    const card = cards.find((candidate) =>
      Array.from(candidate.querySelectorAll("p")).some(
        (name) => name.textContent?.trim() === item.name,
      ),
    );
    if (!card) continue;

    const prices = item.sizes?.map((size) => size.price) ?? [item.price ?? 0];
    const priceNodes = Array.from(card.querySelectorAll<HTMLElement>("span")).filter(
      (node) => /^\s*[\d,\s.]+\s*DA\s*$/.test(node.textContent ?? ""),
    );

    prices.forEach((price, index) => {
      const node = priceNodes[index];
      const nextText = `${price.toLocaleString()} DA`;
      if (node && node.textContent !== nextText) node.textContent = nextText;
    });
  }
}

function loadPublishedMenuPriceSync() {
  syncPublishedOpeningHours();
  fetch(`${basePath}api/gosto/menu`)
    .then((response) => (response.ok ? response.json() : null))
    .then((menu: PublishedMenu | null) => {
      if (!menu) return;
      let scheduled = false;
      const sync = () => {
        scheduled = false;
        syncPublishedMenuPrices(menu);
        syncPublishedOpeningHours();
      };
      const scheduleSync = () => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(sync);
      };
      const observer = new MutationObserver(scheduleSync);
      observer.observe(document.body, { childList: true, subtree: true });
      scheduleSync();
    })
    .catch(() => {
      // The published menu remains usable with its bundled prices if the API is offline.
    });
}

if (path === "/dashboard") {
  Promise.all([import("./index.css"), import("./App")]).then(([, { default: App }]) => {
    createRoot(root).render(<App />);
  });
} else {
  const publishedStyles = document.createElement("link");
  publishedStyles.rel = "stylesheet";
  publishedStyles.href = `${basePath}assets/index-B8a4PXzM.css`;
  document.head.appendChild(publishedStyles);

  const publishedScript = document.createElement("script");
  publishedScript.type = "module";
  publishedScript.src = `${basePath}assets/index-Mczsru17.js`;
  const originalUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const normalizePublishedRoute =
    normalizedBasePath !== "/" && path === "/";

  if (normalizePublishedRoute) {
    window.history.replaceState(window.history.state, "", "/");
  }

  publishedScript.addEventListener(
    "load",
    () => {
      loadPublishedMenuPriceSync();
      if (normalizePublishedRoute) {
        window.setTimeout(() => {
          window.history.replaceState(window.history.state, "", originalUrl);
        }, 500);
      }
    },
    { once: true },
  );
  document.body.appendChild(publishedScript);
}
