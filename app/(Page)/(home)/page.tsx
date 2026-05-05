import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center p-gutter w-full max-w-container-max mx-auto">
      <div className="flex flex-col items-center text-center gap-xl w-full max-w-[800px]">
        <div className="w-48 h-48 bg-tertiary-fixed rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] mb-lg relative overflow-hidden">
          <span className="material-symbols-outlined text-[96px] text-tertiary">
            inventory_2
          </span>
        </div>
        <div className="flex flex-col gap-sm px-4">
          <h1 className="font-display text-display text-tertiary">
            Loader &amp; Unloader Trade Test
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[600px] mx-auto">
            Click the button below to begin.
          </p>
        </div>
        <div className="w-full max-w-[400px] mt-lg">
          <Link href="/exam" className="w-full h-[72px] bg-tertiary text-on-tertiary font-button text-button rounded-xl flex items-center justify-center gap-sm shadow-[0_8px_32px_rgba(0,31,11,0.2)] hover:bg-on-tertiary-fixed-variant active:scale-[0.98] transition-all duration-200">
            Start Test
            <span className="material-symbols-outlined">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
