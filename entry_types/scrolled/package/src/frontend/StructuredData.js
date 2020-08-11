import React from 'react';

export function StructuredData({data}) {
  return (
    <script type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} />
  );
}
