export default function ReportsPage() {
  const metrics = [
    { title: "Open Roles", value: 5 },
    { title: "Qualified On-Hand", value: 12 },
    { title: "Interviews (7d)", value: 3 },
    { title: "New Apps (24h)", value: 8 },
    { title: "Reply Rate", value: "45%" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Reports & Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.title} className="bg-white rounded-md shadow p-4">
            <div className="text-gray-500 text-sm">{metric.title}</div>
            <div className="text-2xl font-semibold">{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
