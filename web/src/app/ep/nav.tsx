"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/ep/panel", label: "Panel de grupos" },
  { href: "/ep/observaciones", label: "Observaciones" },
  { href: "/ep/carpeta", label: "Carpetas" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="mt-8 flex flex-col gap-1" aria-label="Secciones de la entidad">
      {ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-xl px-3 py-2 text-sm ${active ? "bg-primario-claro font-medium text-primario" : "hover:bg-fondo"}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
