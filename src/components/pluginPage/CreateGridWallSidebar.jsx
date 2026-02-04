import React from 'react';

const CreateGridWallSidebar = ({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSubmit,
  isSubmitting,
  isEditMode = false,
}) => {
  const layoutOptions = [
    { value: '1', rows: 2, cols: 1, label: '1x2' },
    { value: '2', rows: 2, cols: 2, label: '2x2' },
    { value: '3', rows: 3, cols: 3, label: '3x3' },
    { value: '4', rows: 4, cols: 4, label: '4x4' },
  ];

  const renderGridPreview = (rows, cols) => {
    const cells = [];
    for (let i = 0; i < rows * cols; i++) {
      cells.push(
        <div
          key={i}
          className="bg-gray-200 border border-gray-300 rounded-sm"
        />
      );
    }
    return cells;
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-[360px] bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditMode ? 'Edit Grid Wall' : 'Create Grid Wall'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grid Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormChange('name', e.target.value)}
              placeholder="Enter text here"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Layout
            </label>
            <div className="grid grid-cols-4 gap-2">
              {layoutOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onFormChange('layout', option.value)}
                  className={`h-16 p-2 rounded-lg border-2 transition cursor-pointer flex items-center justify-center ${
                    formData.layout === option.value
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div
                    className={`grid gap-0.5`}
                    style={{
                      gridTemplateColumns: `repeat(${option.cols}, 1fr)`,
                      gridTemplateRows: `repeat(${option.rows}, 1fr)`,
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    {renderGridPreview(option.rows, option.cols)}
                  </div>
                </button>
              ))}
            </div>
          </div>

     

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Image Setting</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Show Date and Time</span>
                <button
                  type="button"
                  onClick={() => onFormChange('showDateTime', !formData.showDateTime)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    formData.showDateTime ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      formData.showDateTime ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Show Camera Name</span>
                <button
                  type="button"
                  onClick={() => onFormChange('showCameraName', !formData.showCameraName)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    formData.showCameraName ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      formData.showCameraName ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Show Project Name</span>
                <button
                  type="button"
                  onClick={() => onFormChange('showProjectName', !formData.showProjectName)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    formData.showProjectName ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      formData.showProjectName ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
             </div>
          </div>

   

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white text-sm font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {isSubmitting
              ? isEditMode
                ? 'Updating...'
                : 'Creating...'
              : isEditMode
              ? 'Update Grid'
              : 'Create Grid'}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateGridWallSidebar;
