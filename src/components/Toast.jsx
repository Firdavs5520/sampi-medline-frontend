import { Toaster } from "react-hot-toast";
import { FiCheck, FiX, FiLoader } from "react-icons/fi";

export default function AppToast() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 1000,
        style: {
          background: "transparent",
          boxShadow: "none",
        },
      }}
    >
      {(t) => (
        <div
          className={`
            flex items-center justify-center
            w-14 h-14 rounded-full
            transition-all
            ${t.visible ? "animate-toast-in" : "animate-toast-out"}
            ${
              t.type === "success"
                ? "bg-green-600"
                : t.type === "error"
                  ? "bg-brand-red"
                  : ""
            }
          `}
          style={{ marginBottom: "90px" }}
        >
          {t.type === "loading" && (
            <FiLoader className="text-white text-5xl animate-spin" />
          )}
          {t.type === "success" && <FiCheck className="text-white text-2xl" />}
          {t.type === "error" && <FiX className="text-white text-2xl" />}
        </div>
      )}
    </Toaster>
  );
}
