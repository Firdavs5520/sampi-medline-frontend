import { motion, AnimatePresence } from "framer-motion";
import { FiLoader } from "react-icons/fi";

export default function NurseInlineSpinner({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          className="flex justify-center mt-6"
        >
          <div className="w-14 h-14 rounded-full bg-brand-violet flex items-center justify-center shadow-lg">
            <FiLoader className="text-white text-3xl animate-spin" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
