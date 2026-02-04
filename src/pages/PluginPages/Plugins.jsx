import React, { useState, useEffect } from 'react';
import PluginCard from '../../components/pluginPage/PluginCard';
const API_URL = import.meta.env.VITE_API_URL;
const VITE_IMAGE_PATH = import.meta.env.VITE_IMAGE_PATH;
const Plugins = () => {
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlugins = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/plugins`);
        if (!response.ok) {
          throw new Error('Failed to fetch plugins');
        }
        const data = await response.json();
        setPlugins(data.plugins || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching plugins:', err);
        setError(err.message);
        setPlugins([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlugins();
  }, []);
  return (
    <div className="bg-[url('/Sunrise.jpg')] font-dancing w-full bg-no-repeat bg-center bg-cover p-8 min-h-[calc(100vh-56px)]">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Plugins</h1>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <p>Error loading plugins: {error}</p>
          </div>
        )}
        {/* Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {plugins.map((plugin) => (
              <PluginCard
                key={plugin._id}
                id={plugin._id}
                logo={plugin.img}
                title={plugin.heading}
                description={plugin.para}
                status={plugin.status}
                onClick={() => handlePluginClick(plugin)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Plugins;
