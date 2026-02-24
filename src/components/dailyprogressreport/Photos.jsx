import React from "react";

const Photos = ({ photos = [] }) => {
  const defaultPhotos = [
    {
      src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5",
      alt: "Construction Progress 1",
      caption: "Building Structure",
    },
    {
      src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd",
      alt: "Construction Progress 2",
      caption: "Site Overview",
    },
    {
      src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd",
      alt: "Construction Progress 3",
      caption: "Interior Progress",
    },
  ];

  const displayPhotos = photos.length > 0 ? photos : defaultPhotos;

  return (
    <div className="bg-amber-50  shadow-sm">
      <div className=" p-2">
        <h2 className="text-lg font-bold text-center">Progress Photos</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
        {displayPhotos.map((photo, index) => (
          <div key={index} className="bg-gray-50 rounded overflow-hidden">
            <div className="relative h-48">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.parentElement.innerHTML = `
                    <div class="flex items-center justify-center h-full bg-gray-200">
                      <div class="text-center text-gray-500">
                        <div class="text-2xl">📷</div>
                        <div class="text-sm">Photo ${index + 1}</div>
                      </div>
                    </div>
                  `;
                }}
              />
            </div>
            {photo.caption && (
              <div className="p-1 text-sm text-center">{photo.caption}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Photos;
