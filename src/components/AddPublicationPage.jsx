import React, { useState, useEffect } from "react";
import { usePublications } from "../hooks/usePublications";
import { useNavigate } from "react-router-dom";
import { uploadImageToCloudinary } from "../services/publicationService";

export default function AddPublicationPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [previewCover, setPreviewCover] = useState(null); // 👈 buat preview
  const { addPublication } = usePublications();
  const navigate = useNavigate();

  useEffect(() => {
    if (coverFile) {
      const previewUrl = URL.createObjectURL(coverFile);
      setPreviewCover(previewUrl);

      return () => URL.revokeObjectURL(previewUrl); // cleanup
    } else if (title) {
      setPreviewCover(
        `https://placehold.co/200x280/7f8c8d/ffffff?text=${encodeURIComponent(
          title
        )}`
      );
    } else {
      setPreviewCover(null);
    }
  }, [coverFile, title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !releaseDate) {
      alert("Judul dan Tanggal Rilis harus diisi!");
      return;
    }
    let coverUrl = "";
    if (coverFile) {
      try {
        coverUrl = await uploadImageToCloudinary(coverFile);
      } catch (err) {
        alert("Gagal upload gambar: " + err.message);
        return;
      }
    } else {
      coverUrl = `https://placehold.co/200x280/7f8c8d/ffffff?text=${encodeURIComponent(
        title
      )}`;
    }
    const newPublication = {
      title,
      releaseDate,
      description,
      coverUrl,
    };
    try {
      await addPublication(newPublication);
      navigate("/publications");
      setTitle("");
      setReleaseDate("");
      setDescription("");
      setCoverFile(null);
    } catch (err) {
      alert("Gagal menambah publikasi: " + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Form Tambah Publikasi Baru
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Judul
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
            placeholder="Contoh: Statistik Indonesia 2025"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Deskripsi
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
            placeholder="Contoh: Publikasi ini membahas statistik Indonesia di tahun 2025 secara mendalam."
            rows={4}
          />
        </div>

        <div>
          <label
            htmlFor="releaseDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tanggal Rilis
          </label>
          <input
            type="date"
            id="releaseDate"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="cover"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sampul (Gambar)
          </label>
          <input
            type="file"
            id="cover"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* 🔍 PREVIEW IMAGE */}
        {previewCover && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">Preview Sampul:</p>
            <img
              src={previewCover}
              alt="Preview Sampul"
              className="w-48 h-64 object-cover border rounded-md shadow-sm"
            />
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Tambah
          </button>
        </div>
      </form>
    </div>
  );
}