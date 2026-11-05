export default function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 -rotate-[5deg] items-center justify-center gap-0.5 rounded-[9px] bg-[#6858e8] shadow-[0_8px_24px_rgba(104,88,232,0.4)]"
      >
        <i className="block h-[9px] w-1 rounded bg-white" />
        <i className="block h-4 w-1 rounded bg-white" />
        <i className="block h-3 w-1 rounded bg-white" />
      </span>
      <span className="font-[family-name:var(--font-manrope)] text-xl font-extrabold tracking-tight">
        TaskFlow
      </span>
    </span>
  );
}
