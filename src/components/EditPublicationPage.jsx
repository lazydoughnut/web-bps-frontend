import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePublications } from "../hooks/usePublications";
import { publicationService } from "../services/publicationService";
import { uploadImageToCloudinary } from "../services/publicationService";


export default function EditPublicationPage() {
  const { id } = useParams(); // ambil ID dari URL
  const { publications, editPublication } = usePublications();
  const navigate = useNavigate();

  // Cari publikasi berdasarkan ID
  const publication = publications.find((p) => p.id === Number(id));

  // State form
  const [formData, setFormData] = useState({
    title: "",
    releaseDate: "",
    description: "",
    coverFile: null,
    currentCoverUrl: "",
  });

  // State untuk preview
  const [previewCover, setPreviewCover] = useState(null);

  // Isi form dari data publikasi yang ditemukan
  useEffect(() => {
    if (publication) {
      setFormData({
        title: publication.title || "",
        releaseDate: publication.releaseDate || "",
        description: publication.description || "",
        coverFile: null,
        currentCoverUrl: publication.coverUrl || "",
      });
    }
  }, [publication]);

  // Update preview cover
  useEffect(() => {
    if (formData.coverFile) {
      const previewUrl = URL.createObjectURL(formData.coverFile);
      setPreviewCover(previewUrl);
      return () => URL.revokeObjectURL(previewUrl); // bersihin object URL
    } else if (formData.currentCoverUrl) {
      setPreviewCover(formData.currentCoverUrl);
    } else if (formData.title) {
      setPreviewCover(`https://placehold.co/200x280/7f8c8d/ffffff?text=${encodeURIComponent(formData.title)}`);
    } else {
      setPreviewCover(null);
    }
  }, [formData.coverFile, formData.currentCoverUrl, formData.title]);

  // Handle input
  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "cover") {
      setFormData((prev) => ({ ...prev, coverFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
  e.preventDefault();
  const { title, releaseDate, description, coverFile, currentCoverUrl } = formData;

  if (!title || !releaseDate) {
    alert("Judul dan Tanggal Rilis harus diisi!");
    return;
  }

  let coverUrl = currentCoverUrl;

  if (coverFile) {
    // Kalau cover baru diupload, harus upload dulu ke Cloudinary
    try {
      coverUrl = await uploadImageToCloudinary(coverFile);
    } catch (error) {
      alert("Gagal upload gambar: " + error.message);
      return;
    }
  }

  const updatedPublication = {
    title,
    releaseDate,
    description,
    coverUrl,
  };

  try {
    await publicationService.updatePublication(publication.id, updatedPublication); // ← kirim ke backend
    editPublication({ ...publication, ...updatedPublication }); // update state lokal
    navigate("/publications");
  } catch (err) {
    alert("Gagal menyimpan perubahan: " + err.message);
  }
};

  const handleCancel = () => {
    navigate("/publications");
  };

  if (!publication) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <p className="text-center text-gray-500">Publikasi tidak ditemukan.</p>
      </div>
    );
  }

  const { title, releaseDate, description } = formData;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Publikasi</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Judul publikasi..."
            required
          />
        </div>

        <div>
          <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Rilis</label>
          <input
            type="date"
            id="releaseDate"
            value={releaseDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea
            id="description"
            value={description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Deskripsi publikasi..."
          />
        </div>

        <div>
          <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-1">Sampul</label>
          
          {previewCover && (
            <img
              src={previewCover}
              alt="Preview Sampul"
              className="w-32 h-44 object-cover mb-2 border rounded-md"
            />
          )}

          <input
            type="file"
            id="cover"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md">
            Batal
          </button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}