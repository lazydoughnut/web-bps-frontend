// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { usePublications } from "../hooks/usePublications";

// export default function ViewPublicationPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { publications } = usePublications();

//   const publication = publications.find((p) => p.id === Number(id));

//   const [formData, setFormData] = useState({
//     title: "",
//     releaseDate: "",
//     description: "",
//     coverUrl: "",
//   });

//   useEffect(() => {
//     if (publication) {
//       setFormData({
//         title: publication.title,
//         releaseDate: publication.releaseDate,
//         description: publication.description,
//         coverUrl: publication.coverUrl,
//       });
//     }
//   }, [publication]);

//   if (!publication) {
//     return <p className="text-center text-gray-500">Publikasi tidak ditemukan.</p>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Detail Publikasi</h1>

//       <form className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
//           <input
//             type="text"
//             value={formData.title}
//             readOnly
//             className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Rilis</label>
//           <input
//             type="date"
//             value={formData.releaseDate}
//             readOnly
//             className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
//           <textarea
//             value={formData.description}
//             readOnly
//             rows={4}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Sampul</label>
//           <img
//             src={formData.coverUrl || `https://placehold.co/200x280?text=${encodeURIComponent(formData.title)}`}
//             alt="Sampul"
//             className="w-32 h-44 object-cover border rounded-md"
//           />
//         </div>

//         <div className="flex justify-end">
//           <button
//             type="button"
//             onClick={() => navigate("/publications")}
//             className="bg-gray-500 text-white px-4 py-2 rounded-md"
//           >
//             Kembali
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePublications } from "../hooks/usePublications";
import { ArrowLeft } from "lucide-react";

export default function ViewPublicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { publications } = usePublications();

  const publication = publications.find((p) => p.id === Number(id));

  const [formData, setFormData] = useState({
    title: "",
    releaseDate: "",
    description: "",
    coverUrl: "",
  });

  useEffect(() => {
    if (publication) {
      setFormData({
        title: publication.title,
        releaseDate: publication.releaseDate,
        description: publication.description,
        coverUrl: publication.coverUrl,
      });
    }
  }, [publication]);

  if (!publication) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <p className="text-center text-gray-500">Publikasi tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 sm:p-10 rounded-xl shadow-lg mt-6 space-y-6">
      {/* Tombol kembali */}
      <button
        onClick={() => navigate("/publications")}
        className="flex items-center text-sm text-blue-400 hover:text-blue-700 transition gap-1 mb-2"
      >
        <ArrowLeft size={16} />
        <span className="font-bold">Kembali</span>
      </button>

      {/* Judul */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
        {formData.title}
      </h1>

      {/* Konten */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cover */}
        <div className="flex justify-center">
          <img
            src={
              formData.coverUrl ||
              `https://placehold.co/200x280?text=${encodeURIComponent(
                formData.title
              )}`
            }
            alt="Sampul"
            className="w-full max-w-[250px] object-cover rounded-lg shadow-md"
          />
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Info Publikasi */}
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex">
              <span className="w-23 font-medium">ID Publikasi</span>
              <span className="w-2">:</span>
              <span>{id}</span>
            </div>
            <div className="flex">
              <span className="w-23 font-medium">Tanggal Rilis</span>
              <span className="w-2">:</span>
              <span>
                {formData.releaseDate
                  ? new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(formData.releaseDate))
                  : "-"}
              </span>
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Deskripsi
            </h2>
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
              {formData.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}