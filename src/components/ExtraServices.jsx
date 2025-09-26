import { useState } from "react";
import { Plus, Minus, Check } from "lucide-react";

export default function ExtraServices(){
    const reservationCode = "12345";
    const services = [
        { id: 1, name: "Senderismo", description: "Paseo a pie por el páramo de Ocetá", price: 40000, unit: "Persona" },
        { id: 2, name: "Desayuno", description: "Comida casera hecha para comenzar el día", price: 10000, unit: "Persona" },
        { id: 3, name: "Parqueadero", description: "Espacio seguro para tu vehículo", price: 10000, unit: "Vehículo" },
        { id: 4, name: "Paseo", description: "Tour por el pueblo", price: 10000, unit: "Persona" },
    ];

    const [selected, setSelected] = useState({});

    const increment = (id) => {
        setSelected((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const decrement = (id) => {
        setSelected((prev) => {
            if (!prev[id]) return prev;
            if (prev[id] === 1) {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            }
            return { ...prev, [id]: prev[id] - 1 };
        });
    };

    const total = services.reduce(
        (acc, s) => acc + (selected[s.id] || 0) * s.price,
        0
    );

    return (
        <div className="max-w-md mx-auto bg-primary border rounded-lg shadow-md p-4">
            <h2 className="text-center text-lg font-semibold mb-2">
                Servicios adicionales
            </h2>
            <p className="text-sm text-gray-700 mb-4">
                Código de reserva: <span className="font-bold">{reservationCode}</span>
            </p>

            <div className="space-y-3">
                {services.map((s) => (
                    <div key={s.id} className="bg-white p-3 rounded-lg shadow flex flex-col gap-1">
                        <h3 className="font-medium">{s.name}</h3>
                        <p className="text-sm text-gray-600">{s.description}</p>
                        <p className="text-sm font-semibold">
                            Precio: {s.price.toLocaleString()} COP/{s.unit}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                                <button
                                    className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                                    onClick={() => decrement(s.id)}
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-6 text-center">
                                    {selected[s.id] || 0}
                                </span>
                                <button
                                    className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                                    onClick={() => increment(s.id)}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 border-t pt-2 flex justify-between font-semibold">
                <span>TOTAL A PAGAR:</span>
                <span>{total.toLocaleString()} COP</span>
            </div>

            <button className="w-full mt-3 bg-black text-white py-2 rounded-lg hover:bg-gray-900">
                Continuar con la reserva
            </button>
        </div>
    );
}