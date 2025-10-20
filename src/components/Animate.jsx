export function Loading({size="12"}) {
  return (
    <div className={`animate-spin rounded-full h-${size} w-${size} border-b-2 border-blue-600 mx-auto mb-4 flex items-center justify-center`}/>
  );
}