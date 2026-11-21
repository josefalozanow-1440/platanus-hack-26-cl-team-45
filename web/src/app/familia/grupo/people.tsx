// Pieces shared by the family screens that show people of the group (F1, F3, B1).
import { FolioMark } from "@/components/folio";
import { Initials, type Tone } from "@/components/ui";

export type Face = { initials: string; tone: Tone };
export type Activity = Face & { text: string; when: string; live?: boolean };

// shortcut: dato fijo, the API does not return the last families that completed or voted.
export const GROUP_FACES: Face[] = [
  { initials: "AM", tone: "ok" },
  { initials: "VS", tone: "aviso" },
  { initials: "JL", tone: "neutro" },
];

/** Overlapping initials, e.g. the families that already voted. */
export function Faces({ people }: { people: Face[] }) {
  return (
    <span className="flex shrink-0 -space-x-0.5">
      {people.map((person) => (
        <span key={person.initials} className="rounded-lg ring-2 ring-white">
          <Initials tone={person.tone} size="size-6 !rounded-lg !text-[9px]">
            {person.initials}
          </Initials>
        </span>
      ))}
    </span>
  );
}

/** Feed of the group. Folio shows with its blue mark, people with their initials. */
export function ActivityList({ items }: { items: Activity[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.text} className="flex items-center gap-3">
          {item.initials === "F" ? (
            <FolioMark className="size-8 text-xs" />
          ) : (
            <Initials tone={item.tone} size="size-8 !rounded-lg !text-[11px]">
              {item.initials}
            </Initials>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-snug">{item.text}</p>
            <p className="text-xs text-suave">{item.when}</p>
          </div>
          {item.live && <span aria-hidden className="size-2 shrink-0 rounded-full bg-ok" />}
        </li>
      ))}
    </ul>
  );
}
