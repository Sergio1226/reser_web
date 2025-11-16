const colors ={
  green: "border-green-600",
  blue: "border-blue-600",
}

export function Loading({size="12",color="green"}) {
  return (
    <div className={`animate-spin rounded-full h-${size} w-${size} border-b-2  ${colors[color]} mx-auto mb-4 flex items-center justify-center`}/>
  );
}