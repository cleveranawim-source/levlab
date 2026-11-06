"use client";

import { useState } from "react";

/** Reserve the illustration's space while an asset is still being prepared. */
export default function ContentImage({ src, alt, width = 800, height = 600, className = "", priority = false }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`content-image ${className}`} style={{ aspectRatio: `${width} / ${height}` }}>
      {src && !failed ? (
        <img ref={(node) => { if (node?.complete && !node.naturalWidth) setFailed(true); }} src={src} alt={alt} width={width} height={height}
          loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined}
          onError={() => setFailed(true)} />
      ) : <span className="image-placeholder" role="img" aria-label={alt} />}
    </div>
  );
}
