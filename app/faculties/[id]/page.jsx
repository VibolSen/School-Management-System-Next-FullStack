
'use client';

import { useParams } from 'next/navigation';

export default function FacultyPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Faculty ID: {id}</h1>
    </div>
  );
}
