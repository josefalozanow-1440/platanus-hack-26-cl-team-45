"use client";

// Left sidebar of the desktop screens (EP and comité autogestionado), as in the Figma.
import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarItem = { label: string; href?: string; match?: string };

/** A column on a wide screen and a scrolling top bar on a phone. Items without href are sections the Figma shows but that have no screen yet. */
export function Sidebar({ subtitle, items, className = "" }: { subtitle: string; items: SidebarItem[]; className?: string }) {
  const pathname = usePathname();
  return (
    <aside className={`shrink-0 border-b border-linea bg-white px-4 py-3 lg:w-60 lg:border-r lg:border-b-0 lg:py-8 ${className}`}>
      <p className="px-3 font-semibold">Folio</p>
      <p className="px-3 text-xs text-suave">{subtitle}</p>
      <nav className="mt-2 flex gap-1 overflow-x-auto lg:mt-8 lg:flex-col" aria-label="Secciones">
        {items.map((item) => {
          if (!item.href) {
            return (
              <span key={item.label} className="rounded-xl px-3 py-2 text-sm whitespace-nowrap text-suave">
                {item.label}
              </span>
            );
          }
          const active = pathname.startsWith(item.match ?? item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-xl px-3 py-2 text-sm whitespace-nowrap ${active ? "bg-primario-claro font-medium text-primario" : "hover:bg-fondo"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

/** Page shell of every role: the sidebar next to (or above) the content. */
export function Shell({
  subtitle,
  items,
  sidebarClassName,
  children,
}: {
  subtitle: string;
  items: SidebarItem[];
  sidebarClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-fondo text-tinta lg:flex-row">
      <Sidebar subtitle={subtitle} items={items} className={sidebarClassName} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
