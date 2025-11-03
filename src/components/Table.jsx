export function Table({ headers, info, renderActions }) {
  return (
    <div className="w-full bg-white rounded-lg border border-black/20 overflow-x-auto">
      <div>

        <div className="flex bg-gray-100 p-3 border-b border-black/10 items-center">
          {headers.map((header, index) => (
            <div
              className="text-sm font-semibold text-center flex-1"
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