export function CardForm({ children, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-2xl border border-primary_dark/20 shadow-xl space-y-6 [&>h2]:text-4xl [&>h2]:font-bold [&>h2]:text-primary_dark [&>h2]:text-center  [&>p]:text-gray-600 [&>p]:text-center"
    >
      {children}
    </form>
  );
}
