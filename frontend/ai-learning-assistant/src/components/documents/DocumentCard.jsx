import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from "lucide-react";
import moment from "moment";

const formatFileSize = (bytes) => {
  if (!bytes) return "N/A";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${document.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group relative bg-white rounded-lg border border-slate-200 
      p-8 w-full max-w-[350px] shadow-sm hover:shadow-md 
      transition-all duration-200 cursor-pointer
      hover:bg-gradient-to-b hover:from-emerald-50 hover:to-white"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="w-9 h-9 rounded-md bg-emerald-500/10 flex items-center justify-center">
          <FileText className="w-4 h-4 text-emerald-600" strokeWidth={2} />
        </div>

        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      <h3
        className="text-sm font-semibold text-slate-900 mb-1 truncate"
        title={document.title}
      >
        {document.title}
      </h3>

      <p className="text-xs text-slate-500 mb-2">
        {formatFileSize(document.fileSize)}
      </p>

      <div className="flex flex-wrap gap-1 mb-2">
        {document.flashcardCount !== undefined && (
          <div className="flex items-center gap-1 bg-purple-100 text-purple-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
            <BookOpen className="w-3 h-3" strokeWidth={2} />
            {document.flashcardCount}
          </div>
        )}
        {document.quizCount !== undefined && (
          <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
            <BrainCircuit className="w-3 h-3" strokeWidth={2} />
            {document.quizCount}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 my-1"></div>

      <div className="flex items-center text-[11px] text-slate-500 gap-1">
        <Clock className="w-3 h-3" strokeWidth={2} />
        {moment(document.createdAt).fromNow()}
      </div>
    </div>
  );
};

export default DocumentCard;

// const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ⬅️ for mobile toggle
// const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
// <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />;
