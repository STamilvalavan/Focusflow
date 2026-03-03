export default function ProgressBar({ progress }) {
  return (
    <div className="bg-slate-800 p-4 rounded-2xl shadow-lg">
      <div className="flex justify-between mb-2">
        <span>Daily Progress</span>
        <span>{progress}%</span>
      </div>

      <div className="w-full bg-slate-700 h-3 rounded-full">
        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}