export default function Admin() {
  return (
    <div className="h-full w-full">
      <h1 className="text-2xl font-semibold mb-4">Admin Panel</h1>
      <p className="text-sm text-slate-400">
        This route is protected. Only logged-in users can see it.
      </p>
    </div>
  );
}
