// src/components/Footer.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  if (location.pathname === "/login") {
    return null;
  }
  return (
    <footer className="bg-[#185088] shadow-lg text-center py-5">
      <p className="text-white font-500 text-sm">
        Created by Qurany Nadhira Tsabita (222313323@stis.ac.id)
      </p>
    </footer>
  );

  
}