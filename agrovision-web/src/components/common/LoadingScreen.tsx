import { motion } from "framer-motion";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({
  message = "Cargando...",
}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-white to-green-50">
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          rotate: [0, -2, 2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="text-8xl"
      >
        🌱
      </motion.div>

      <h1 className="mt-6 text-4xl font-bold text-green-700">
        AgroVision
      </h1>

      <p className="mt-2 text-slate-500">
        {message}
      </p>

      <div className="mt-8 h-3 w-80 overflow-hidden rounded-full bg-green-100">
        <motion.div
          className="h-full rounded-full bg-green-600"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}