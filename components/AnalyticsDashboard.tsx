import React from 'react';

const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-gray-800 text-white flex-1">
      <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
      <p className="mt-2 text-gray-400">This feature is currently under development.</p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-700/50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-300">Total Queries</h3>
          <p className="mt-2 text-4xl font-bold text-teal-400">1,234</p>
        </div>
        <div className="bg-gray-700/50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-300">Positive Feedback</h3>
          <p className="mt-2 text-4xl font-bold text-green-500">92%</p>
        </div>
        <div className="bg-gray-700/50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-300">Avg. Response Time</h3>
          <p className="mt-2 text-4xl font-bold text-yellow-500">1.8s</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
