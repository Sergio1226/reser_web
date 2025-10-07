import { motion, AnimatePresence } from "framer-motion";
const colors = {
  success: "bg-green-100 border-green-500 text-green-800",
  warning: "bg-yellow-100 border-yellow-500 text-yellow-800",
  error: "bg-red-100 border-red-500 text-red-800",
  info: "bg-blue-100 border-blue-500 text-blue-800",
};
const texts = {
  success: "text-green-800",
  warning: " text-yellow-800",
  error: " text-red-800",
  info: " text-blue-800",
};

export function Popup({ show, onClose, children, color }) {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`relative w-fit max-w-md  rounded-2xl shadow-2xl p-6  border ${colors[color]}`}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, type: "spring", stiffness: 150 }}
            >
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
              <div className={`p-4 text-center  text-2xl ${texts[color]}`}>
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
