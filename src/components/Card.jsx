import { motion } from "framer-motion";

export default function Card({ title, value, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="
        bg-white rounded-3xl shadow-xl
        p-6 border border-slate-100
        transition
      "
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        {icon && (
          <div className="p-2 rounded-xl bg-brand-violet/10 text-brand-violet">
            {icon}
          </div>
        )}
      </div>

      <p className="mt-2 text-2xl sm:text-3xl font-bold text-brand-dark">
        {value}
      </p>
    </motion.div>
  );
}
