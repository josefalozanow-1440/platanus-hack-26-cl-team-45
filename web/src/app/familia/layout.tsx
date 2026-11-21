import type { ReactNode } from "react";

// Family screens are made for the phone: on a laptop they show inside a phone-sized frame.
export const dynamic = "force-dynamic";

export default function FamilyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen sm:py-8">
      <div className="mx-auto min-h-screen max-w-[390px] bg-fondo px-4 pb-8 pt-6 sm:min-h-[844px] sm:rounded-[36px] sm:border sm:border-linea sm:shadow-xl">
        {children}
      </div>
    </div>
  );
}
