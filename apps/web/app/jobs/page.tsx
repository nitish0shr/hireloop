export default function JobsPage() {
  const jobs = [
    { id: "J-101", title: "Frontend Engineer", location: "Remote - US", department: "Engineering", openings: 2 },
    { id: "J-102", title: "Data Scientist", location: "Toronto, CA", department: "Data", openings: 1 },
    { id: "J-103", title: "Product Manager", location: "NYC, NY", department: "Product", openings: 1 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Open Positions</h1>
      <table className="min-w-full bg-white rounded-md shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Job ID</th>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Location</th>
            <th className="px-4 py-2 text-left">Department</th>
            <th className="px-4 py-2 text-left">Openings</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-t">
              <td className="px-4 py-2">{job.id}</td>
              <td className="px-4 py-2">{job.title}</td>
              <td className="px-4 py-2">{job.location}</td>
              <td className="px-4 py-2">{job.department}</td>
              <td className="px-4 py-2">{job.openings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
