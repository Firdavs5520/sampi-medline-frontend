import Navbar from "../components/Navbar";

export default function ManagerLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="p-6">{children}</main>
    </div>
  );
}
