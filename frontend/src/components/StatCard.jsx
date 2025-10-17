export default function StatCard({ title, value, color }) {
  return (
    <div
      className={`p-5 rounded-2xl shadow-md text-black ${color} flex flex-col justify-between`}
    >
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
