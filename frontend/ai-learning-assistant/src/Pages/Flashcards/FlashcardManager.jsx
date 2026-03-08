import React, { useState, useEffect } from "react";
import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import Flashcard from "./Flashcard";
import { toast } from "react-toastify";
import { Plus, Trash2, Sparkles, Brain } from "lucide-react";
import moment from "moment";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const response =
        await flashcardService.getFlashcardsForDocument(documentId);

      setFlashcardSets(response.data);
    } catch (error) {
      toast.error("Failed to fetch flashcards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchFlashcardSets();
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);

    try {
      await aiService.generateFlashcards(documentId);

      toast.success("Flashcards generated!");
      fetchFlashcardSets();
    } catch (error) {
      toast.error("Failed to generate flashcards");
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);
  };

  const handleDeleteRequest = (e, set) => {
    e.preventDefault();
    e.stopPropagation();

    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;

    setDeleting(true);

    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);

      toast.success("Flashcard set deleted");

      setIsDeleteModalOpen(false);
      setSetToDelete(null);

      fetchFlashcardSets();
    } catch (error) {
      toast.error("Failed to delete set");
    } finally {
      setDeleting(false);
    }
  };

  const renderSetList = () => {
    if (loading) return <Spinner />;

    if (flashcardSets.length === 0) {
      return (
        <div className="text-center py-20">
          <Brain className="w-14 h-14 mx-auto text-gray-400 mb-4" />

          <h3 className="text-lg font-semibold mb-2">No Flashcards Yet</h3>

          <p className="text-gray-500 mb-6">
            Generate flashcards from your document.
          </p>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg flex items-center gap-2 mx-auto hover:bg-emerald-400"
          >
            <Sparkles className="w-4 h-4" />

            {generating ? "Generating..." : "Generate Flashcards"}
          </button>
        </div>
      );
    }

    return (
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold">Your Flashcard Sets</h3>

            <p className="text-gray-500">
              {flashcardSets.length}{" "}
              {flashcardSets.length === 1 ? "set" : "sets"}
            </p>
          </div>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-400"
          >
            <Plus className="w-4 h-4" />

            {generating ? "Generating..." : "Generate New Set"}
          </button>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {flashcardSets.map((set) => (
            <div
              key={set._id}
              onClick={() => handleSelectSet(set)}
              className="group relative bg-white border-2 border-emerald-300 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer max-w-md"
            >
              {/* Delete Button */}
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 size={18} />
              </button>

              {/* Icon */}
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Brain className="text-emerald-600" size={22} />
              </div>

              {/* Title */}
              <h4 className="text-lg font-semibold text-gray-800">
                Flashcard Set
              </h4>

              {/* Date */}
              <p className="text-sm text-gray-500 mt-1 uppercase tracking-wide">
                CREATED {moment(set.createdAt).format("MMM D, YYYY")}
              </p>

              <div className="border-t my-4"></div>

              {/* Cards Count */}
              <span className="inline-block px-4 py-1 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-700">
                {set.cards.length} cards
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flashcard-manager p-6">
      {selectedSet ? (
        <Flashcard card={selectedSet.cards[0]} />
      ) : (
        renderSetList()
      )}

      {/* DELETE MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set?"
      >
        <div className="space-y-6">
          <p>
            Are you sure you want to delete this flashcard set? This action
            cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FlashcardManager;
