import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { PageSpinner, ButtonSpinner } from "../components/Spinner";
import api from "../api";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CalendarDays,
  ImagePlus,
  LogOut,
  UserRound,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import rccgLogo from "../assets/download (1).jpg";
import yayaLogo from "../assets/yaya.png";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [speakers, setSpeakers] = useState([]);
  const [speakerForm, setSpeakerForm] = useState({
    name: "",
    title: "",
    image: null,
    preview: null,
  });
  const [addingSpeaker, setAddingSpeaker] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    api
      .get(`/events/${id}`)
      .then((res) => {
        const e = res.data;
        setForm({
          title: e.title,
          description: e.description,
          date: e.date ? e.date.slice(0, 10) : "",
          time: e.time,
          location: e.location,
        });
        if (e.image) setPreview(e.image);
        if (e.speakers) setSpeakers(e.speakers);
      })
      .catch(() => toast.error("Failed to load event"))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSpeakerImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSpeakerForm((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  const handleAddSpeaker = async () => {
    if (!speakerForm.name.trim()) {
      toast.error("Speaker name is required");
      return;
    }
    setAddingSpeaker(true);
    try {
      const fd = new FormData();
      fd.append("name", speakerForm.name.trim());
      fd.append("title", speakerForm.title.trim());
      if (speakerForm.image) fd.append("image", speakerForm.image);
      const res = await api.post(`/events/${id}/speakers`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSpeakers(res.data.speakers);
      setSpeakerForm({ name: "", title: "", image: null, preview: null });
      toast.success("Speaker added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add speaker");
    } finally {
      setAddingSpeaker(false);
    }
  };

  const handleDeleteSpeaker = async (speakerId) => {
    setDeletingId(speakerId);
    try {
      const res = await api.delete(`/events/${id}/speakers/${speakerId}`);
      setSpeakers(res.data.speakers);
      toast.success("Speaker removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove speaker");
    } finally {
      setDeletingId(null);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (image) formData.append("image", image);
      await api.put(`/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Event updated!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <PageSpinner label="Loading event…" />;

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-amber-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-orange-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={rccgLogo}
            alt="RCCG"
            className="w-9 h-9 rounded-full object-cover"
          />
          <img
            src={yayaLogo}
            alt="YaYa"
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            LHP-YAYA
          </span>
          <span className="ml-2 text-xs bg-orange-100 text-[#ff9324] font-semibold px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:block">
            Hi, {user?.name}
          </span>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-1.5 text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-50 transition"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      <div className="px-4 py-10">
        <div className="max-w-xl mx-auto">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#ff9324] mb-6 transition"
          >
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ff9324] shadow-lg mb-4">
              <CalendarDays className="text-white" size={26} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
            <p className="text-gray-500 text-sm mt-1">
              Update the event details below
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Event Banner{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-orange-200 rounded-2xl hover:border-[#ff9324] transition bg-orange-50 overflow-hidden">
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <ImagePlus
                        size={28}
                        className="text-[#ff9324] opacity-60"
                      />
                      <span className="text-xs">Click to change image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImage}
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9324] focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9324] focus:border-transparent transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9324] focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Time
                  </label>
                  <input
                    type="text"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9324] focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9324] focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff9324] hover:bg-orange-500 active:scale-95 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-orange-200 disabled:opacity-60 mt-2"
              >
                {loading ? <ButtonSpinner label="Saving…" /> : "Save Changes"}
              </button>
            </form>
          </div>

          {/* ─── Manage Speakers ─── */}
          <div className="mt-8 bg-white rounded-3xl shadow-xl border border-orange-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#ff9324] flex items-center justify-center shrink-0">
                <UserRound size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Manage Speakers
                </h2>
                <p className="text-xs text-gray-500">
                  Add or remove speakers shown on the registration page
                </p>
              </div>
            </div>

            {/* Existing speakers */}
            {speakers.length > 0 ? (
              <div className="space-y-3 mb-6">
                {speakers.map((spk) => (
                  <div
                    key={spk._id}
                    className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3"
                  >
                    {spk.image ? (
                      <img
                        src={spk.image}
                        alt={spk.name}
                        className="w-12 h-12 rounded-xl object-cover border border-orange-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                        <UserRound size={20} className="text-[#ff9324]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {spk.name}
                      </p>
                      {spk.title && (
                        <p className="text-xs text-[#ff9324] font-medium truncate">
                          {spk.title}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteSpeaker(spk._id)}
                      disabled={deletingId === spk._id}
                      className="w-8 h-8 rounded-xl bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-500 transition shrink-0 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 mb-6 bg-orange-50 rounded-2xl border border-dashed border-orange-200">
                <UserRound size={28} className="text-orange-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No speakers added yet</p>
              </div>
            )}

            {/* Add new speaker form */}
            <div className="border-t border-orange-100 pt-5 space-y-4">
              <p className="text-sm font-semibold text-gray-700">
                Add a New Speaker
              </p>

              {/* Photo upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Photo{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <label className="cursor-pointer flex items-center gap-3 w-full border-2 border-dashed border-orange-200 rounded-2xl p-3 hover:border-[#ff9324] transition bg-orange-50 overflow-hidden">
                  {speakerForm.preview ? (
                    <img
                      src={speakerForm.preview}
                      alt="speaker"
                      className="w-14 h-14 rounded-xl object-cover border border-orange-200"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">
                      <ImagePlus
                        size={22}
                        className="text-[#ff9324] opacity-60"
                      />
                    </div>
                  )}
                  <span className="text-xs text-gray-400">
                    {speakerForm.preview
                      ? "Click to change photo"
                      : "Click to upload speaker photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleSpeakerImageChange}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={speakerForm.name}
                  onChange={(e) =>
                    setSpeakerForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Dr. Jane Smith"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9324] focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Role / Title / Bio
                </label>
                <input
                  type="text"
                  value={speakerForm.title}
                  onChange={(e) =>
                    setSpeakerForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="e.g. CEO, Pioneer Airline & Keynote Speaker"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9324] focus:border-transparent transition"
                />
              </div>

              <button
                type="button"
                onClick={handleAddSpeaker}
                disabled={addingSpeaker}
                className="w-full flex items-center justify-center gap-2 bg-[#ff9324] hover:bg-orange-500 active:scale-95 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-orange-200 disabled:opacity-60"
              >
                {addingSpeaker ? (
                  <ButtonSpinner label="Adding…" />
                ) : (
                  <>
                    <Plus size={16} /> Add Speaker
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
