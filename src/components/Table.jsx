export function Table({ headers, info, renderActions }) {
  return (
    <div className="w-full bg-white rounded-lg border border-black/20 overflow-x-auto shadow-md">
      <div>

        <div className="flex bg-gray-100 p-3 border-b border-black/10 items-center">
          {headers.map((header, index) => (
            <div
              className="text-sm font-semibold text-center flex-1 "
              key={index}
            >
              {header.label}
            </div>
          ))}
          {renderActions && (
            <div className="text-sm font-semibold text-center flex-1">
              Acciones
            </div>
          )}
        </div>

        <div className="divide-y divide-black/10">
          {info.map((item, index) => (
            <div
              className="flex items-center p-3 [&>*]:text-sm [&>*]:text-center [&>*]:flex-1"
              key={index}
            >
              {headers.map((header, i) => (
                <div key={i}>{item[header.key] ?? "—"}</div>
              ))}
              {renderActions && (
                <div>{renderActions(item)}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableArray({ headers, info, children }) {
  return (
    <div className="w-full overflow-x-auto">
     <div className="min-w-full bg-white rounded-lg border border-black/20 shadow-md">
       <div className="flex bg-gray-100 p-3 border-b border-black/10 items-center min-w-[600px]">
          {headers.map((item, index) => (
            <div
              key={index}
              className="text-sm font-semibold text-center flex-1 min-w-[120px]"
            >
              {item}
            </div>
          ))}
          {children && (
            <div className="text-sm font-semibold text-center flex-1 min-w-[120px]">
              Acciones
            </div>
          )}
        </div>

        <div className="divide-y divide-black/10 min-w-[600px]">
          {info.map((row, index) => (
            <div
              key={index}
              className="flex items-center p-3 [&>*]:text-sm [&>*]:text-center [&>*]:flex-1 bg-white"
            >
              {row.map((cell, i) => (
                <div key={i} className="min-w-[120px]">
                  {cell}
                </div>
              ))}
              {children && (
                <div className="flex items-center justify-center px-2 min-w-[120px]">
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
