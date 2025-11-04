import { useState } from "react";
import { Button } from "./Button.jsx";
import { Icon } from "./Icon.jsx";
export function CancelBookingModal({ isOpen, onClose, onConfirm, bookingInfo }) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-[scale-in_0.2s_ease-out]">
        <Button
          onClick={onClose}
          style="exit"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors "
        >
          <Icon name="exit" style="mr-0 " />
        </Button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Icon name="warning" style="size-[30px] mr-0" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Cancelar Reserva
          </h2>
        </div>

        <div className="mb-6 space-y-3">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas cancelar esta reserva?
          </p>

          {bookingInfo && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Cliente:</span>
                <span className="font-medium text-gray-900">
                  {bookingInfo.cliente}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium text-gray-900">
                  {bookingInfo.checkIn}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium text-gray-900">
                  {bookingInfo.checkOut}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Habitación(es):</span>
                <span className="font-medium text-gray-900">
                  {bookingInfo.habitaciones}
                </span>
              </div>
            </div>
          )}

          <p className="text-sm text-red-600 font-medium">
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            No, mantener
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? <>Cancelando...</> : "Sí, cancelar reserva"}
          </button>
        </div>
      </div>
    </div>
  );
}
