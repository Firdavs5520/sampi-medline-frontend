export default function Card({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-teal-700 mt-1">{value}</p>
    </div>
  );
}
