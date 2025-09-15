
import React from 'react';



const PlaceholderView = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-white p-8 rounded-xl shadow-md">
      <svg className="w-24 h-24 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.49 19.49L21 21m-1.51-1.51l-1.42-1.42M4.51 19.49L3 21m1.51-1.51l1.42-1.42M12 4V2m0 20v-2m8-10h2M2 12h2" />
      </svg>
      <h1 className="text-3xl font-bold text-slate-700">{title}</h1>
      <p className="mt-2 text-slate-500">This feature is currently under construction.</p>
      <p className="text-slate-400">Please check back later!</p>
    </div>
  );
};

export default PlaceholderView;
