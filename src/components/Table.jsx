export function Table({ headers, info, children }) {
  return (
    <div className="w-full bg-white rounded-lg border border-black/20 overflow-x-auto shadow-md">
      <div>
        <div className="flex bg-gray-100 p-3 border-b border-black/10 items-center">
          {headers.map((item, index) => (
            <div
              className="text-sm font-semibold text-center flex-1"
              key={index}
            >
              {item}
            </div>
          ))}
          {children && (
            <div className="text-sm font-semibold text-center flex-1">
              Acciones
            </div>
          )}
        </div>
        <div className="divide-y divide-black/10">
          {info.map((item, index) => (
            <div className="flex items-center p-3 [&>*]:text-sm [&>*]:text-center [&>*]:flex-1 ">
              {item.map((sec) => (
                <div>{sec}</div>
              ))}
              {children && (
                <div className="flex items-center justify-center px-2">
                  {typeof children === "function" ? children(index) : children}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
