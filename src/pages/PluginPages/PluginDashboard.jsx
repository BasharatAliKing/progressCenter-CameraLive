import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import GridCard from '../../components/pluginPage/GridCard';
import CreateGridWallSidebar from '../../components/pluginPage/CreateGridWallSidebar';
import { authHeader, getUserData } from '../../utilities/auth';
const API_URL = import.meta.env.VITE_API_URL;
const VITE_IMAGE_PATH = import.meta.env.VITE_IMAGE_PATH;
const PluginDashboard = () => {
  const { pluginName } = useParams();
  const navigate = useNavigate();
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingGrid, setEditingGrid] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    layout: '1',
    showDateTime: false,
    showProjectName: false,
    showCameraName: false,
  });

  useEffect(() => {
    fetchGridData();
  }, []);

  const fetchGridData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/gridwall`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch grid data');
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        // Transform API data to match GridCard component props
        const getImageSlots = (layout) => {
          const layoutNum = Number(layout);
          if (layoutNum === 1) return 2;
          if (layoutNum === 2) return 4;
          if (layoutNum === 3) return 9;
          if (layoutNum === 4) return 16;
          return 4;
        };

        const transformedData = result.data.map((item) => ({
          id: item._id,
          title: item.name,
          images: Array(getImageSlots(item.layout)).fill(''),
          status: item.status === 'active' ? 'Published' : 'Draft',
          createdOn: new Date(item.createdAt).toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }).replace(',', ' ·'),
          createdBy: item.createdBy,
          createdByAvatar: item.createdBy?.charAt(0) || 'U',
          layout: item.layout,
          showDateTime: item.showDateTime,
          showProjectName: item.showProjectName,
          showCameraName: item.showCameraName,
        }));
        setGridData(transformedData);
      }
    } catch (err) {
      console.error('Error fetching grid data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setEditingGrid(null);
    setFormData({
      name: '',
      layout: '1',
      showDateTime: false,
      showProjectName: false,
      showCameraName: false,
    });
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateGrid = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const user = getUserData();
      const payload = {
        name: formData.name.trim(),
        layout: formData.layout,
        showDateTime: formData.showDateTime,
        showProjectName: formData.showProjectName,
        showCameraName: formData.showCameraName,
      };

      // Add createdBy and creatorId only if creating (not editing)
      if (!editingGrid) {
        payload.createdBy =
          user?.name ||
          user?.fullName ||
          user?.username ||
          user?.email ||
          'Unknown';
        payload.creatorId = user?.id || user?._id || user?.userId || user?.uid || 'unknown';
      }

      const url = editingGrid ? `${API_URL}/gridwall/${editingGrid.id}` : `${API_URL}/gridwall`;
      const method = editingGrid ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...authHeader(),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingGrid ? 'update' : 'create'} grid`);
      }

      await response.json();
      setFormData({
        name: '',
        layout: '1',
        showDateTime: false,
        showProjectName: false,
        showCameraName: false,
      });
      setEditingGrid(null);
      setIsCreateOpen(false);
      fetchGridData();
    } catch (err) {
      console.error('Error submitting grid:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGridClick = (grid) => {
    console.log('Grid clicked:', grid);
    // Navigate to grid details
  };

  const handleEdit = (grid) => {
    setEditingGrid(grid);
    setFormData({
      name: grid.title,
      layout: grid.layout,
      showDateTime: grid.showDateTime,
      showProjectName: grid.showProjectName,
      showCameraName: grid.showCameraName,
    });
    setIsCreateOpen(true);
  };

  const handleDelete = async (grid) => {
    if (!confirm(`Are you sure you want to delete "${grid.title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/gridwall/${grid.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete grid');
      }

      // Refresh the grid list
      fetchGridData();
    } catch (err) {
      console.error('Error deleting grid:', err);
      alert('Failed to delete grid: ' + err.message);
    }
  };

  return (
    <div className="bg-[url('/Sunrise.jpg')] bg-no-repeat bg-center bg-cover min-h-[calc(100vh-56px)]">
       <div className="flex justify-between text-sm px-8 py-4 pt-6 text-[#667085] bg-[#ffffffb9]">
         <div>
             <Link className="text-[#667085] duration-500 hover:scale-105" to="/dashboard">
            Dashboard
          </Link>
          {" "}/{" "}
          <Link to="/plugins" className="text-[#667085] duration-500 hover:scale-105">
            Plugins
          </Link>
          {" "}/{" "}
          <span className="font-medium text-[#101828]">{pluginName || 'GridWall'}</span>
          <h1 className="text-3xl font-bold text-gray-900">{pluginName || 'GridWall'}</h1>
        </div>
        {/* Page Header */}
          <button
            onClick={handleCreateNew}
            className="bg-primary my-auto cursor-pointer text-white text-sm font-semibold py-2 px-6 rounded-lg transition flex items-center gap-2"
          >
            <span className="text-xl mt-[-3px]">+</span>
            Create {pluginName || 'GridWall'}
          </button>
       </div>
        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-8">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-gray-600">Loading grid data...</div>
            </div>
          ) : error ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-red-600">Error: {error}</div>
            </div>
          ) : gridData.length === 0 ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-gray-600">No grids found. Create your first grid!</div>
            </div>
          ) : (
            gridData.map((grid) => (
              <GridCard
                key={grid.id}
                title={grid.title}
                layout={grid.layout}
                showDateTime={grid.showDateTime}
                showProjectName={grid.showProjectName}
                showCameraName={grid.showCameraName}
                images={grid.images}
                status={grid.status}
                createdOn={grid.createdOn}
                createdBy={grid.createdBy}
                createdByAvatar={grid.createdByAvatar}
                onClick={() => handleGridClick(grid)}
                onEdit={() => handleEdit(grid)}
                onDelete={() => handleDelete(grid)}
              />
            ))
          )}
        </div>
        <CreateGridWallSidebar
          isOpen={isCreateOpen}
          onClose={handleCloseCreate}
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleCreateGrid}
          isSubmitting={isSubmitting}
          isEditMode={!!editingGrid}
        />
      </div>
  );
};

export default PluginDashboard;
