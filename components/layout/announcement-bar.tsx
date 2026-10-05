/** Thin promotional strip above the header. Static copy until a CMS or promo module exists. */
export function AnnouncementBar() {
  return (
    <div className="bg-ink text-bone">
      <div className="mx-auto flex h-9 w-full max-w-[1680px] items-center justify-center px-5">
        <p className="text-[10px] tracking-[0.22em] uppercase sm:text-[11px] sm:tracking-[0.24em]">
          Complimentary shipping on orders over $150
        </p>
      </div>
    </div>
  );
}