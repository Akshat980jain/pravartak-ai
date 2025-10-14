const ReferenceViewer = () => {
  const images = [
    { name: "Home", path: "/reference/GovernmentHome.svg" },
    { name: "Registration", path: "/reference/RegistrationForm.svg" },
    { name: "Track Application", path: "/reference/TrackApplication.svg" },
    { name: "Reports", path: "/reference/ReportsDashboards.svg" },
    { name: "Grievance", path: "/reference/GrievanceFeedback.svg" }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Reference Images</h1>
      <div className="space-y-12">
        {images.map((img) => (
          <div key={img.name} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">{img.name}</h2>
            <div className="border rounded overflow-auto">
              <img src={img.path} alt={img.name} className="w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferenceViewer;
