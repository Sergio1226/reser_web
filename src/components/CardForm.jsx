export function CardForm({ children, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white/90 backdrop-blur-md p-10 rounded-2xl w-[380px] border border-primary_dark/20 shadow-xl space-y-6 [&>h2]:text-4xl [&>h2]:font-bold [&>h2]:text-primary_dark [&>h2]:text-center  [&>p]:text-gray-600 [&>p]:text-center "
    >
      {children}
    </form>
  );
}
