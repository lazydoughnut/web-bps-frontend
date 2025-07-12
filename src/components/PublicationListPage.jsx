import React from "react";
import { usePublications } from "../hooks/usePublications";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash } from "lucide-react";
import { publicationService } from "../services/publicationService";

export default function PublicationListPage() {
  const { publications, loading, error } = usePublications(); // Mendapatkan publications dari hook
  const navigate = useNavigate();

  // Log data publications untuk debugging
  console.log("Publications:", publications);

  // Cek loading dan error
  if (loading) {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500" />
      <span className="ml-3 text-blue-700 font-semibold">Loading...</span>
    </div>
  );
}
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Apakah anda yakin ingin menghapus publikasi ini?");
    if (!confirmDelete) return;

    try {
      await publicationService.deletePublication(id);
      alert("Publikasi berhasil dihapus!");
      window.location.reload(); 
    } catch (err) {
      alert("Gagal menghapus publikasi: " + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Daftar Publikasi BPS
        </h1>
        <p className="text-gray-500 mt-1">Publikasi Buku yang disusun berdasarkan hasil kegiatan sensus, survei, dan/atau kegiatan statistik lainnya yang diselenggarakan oleh BPS.</p>
      </header>
      <div className="relative overflow-x-auto shadow-xl rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-white uppercase bg-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-center w-16">
                No
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Judul
              </th>
              <th scope="col" className="px-6 py-3">
                Tanggal Rilis
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Sampul
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Detail
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(publications) && publications.length > 0 ? (
              publications.map((pub, idx) => (
                <tr
                  key={pub.id}
                  className="bg-white border-b hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 text-center">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {pub.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {pub.releaseDate
                      ? new Intl.DateTimeFormat("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(pub.releaseDate))
                      : "-"}
                  </td>
                  <td className="px-6 py-4 flex justify-center items-center">
                    <img
                      src={pub.coverUrl}
                      alt={`Sampul ${pub.title}`}
                      className="h-24 w-auto object-cover rounded shadow-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/100x140/cccccc/ffffff?text=Error";
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold"
                        onClick={() => navigate(`/publications/view/${pub.id}`)}
                      >
                        Lihat
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1"
                        onClick={() => navigate(`/publications/edit/${pub.id}`)}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1"
  onClick={() => handleDelete(pub.id)}
>
  <Trash size={14} />
</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Tidak ada publikasi yang tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}