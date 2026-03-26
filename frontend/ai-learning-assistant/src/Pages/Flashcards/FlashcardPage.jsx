import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Trash2, Plus } from "lucide-react";

import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import Flashcard from "../../Pages/Flashcards/Flashcard";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import { toast } from "react-hot-toast";

const FlashcardsPage = () => {
  const { id: documentId } = useParams();

  const [flashcardSets, setFlashcardSets] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // 🔥 Fetch flashcards
  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response =
        await flashcardService.getFlashcardsForDocument(documentId);

      console.log("API Response:", response.data); // ✅ DEBUG

      // ✅ Handle multiple possible structures
      if (Array.isArray(response.data)) {
        setFlashcardSets(response.data);
        setFlashcards(response.data[0]?.cards || []);
      } else if (response.data?.cards) {
        setFlashcards(response.data.cards);
      } else {
        setFlashcards([]);
      }

      setCurrentCardIndex(0);
    } catch (error) {
      toast.error("Failed to fetch flashcards.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchFlashcards();
  }, [documentId]);

  // 🔥 Generate flashcards
  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully!");
      await fetchFlashcards();
    } catch (error) {
      toast.error("Failed to generate flashcards.");
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  // 🔥 Delete flashcards
  const handleDeleteFlashcardSet = async () => {
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(documentId);
      toast.success("Flashcards deleted successfully!");
      setFlashcards([]);
      setFlashcardSets([]);
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete flashcards.");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  // 🔥 Render content
  const renderFlashcardContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center mt-10">
          <Spinner />
        </div>
      );
    }

    if (!flashcards || flashcards.length === 0) {
      return (
        <div className="text-center mt-10 text-gray-500">
          No flashcards available. Generate them first.
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-6 mt-6">
        {/* ✅ SAFE RENDER */}
        {flashcards[currentCardIndex] && (
          <Flashcard card={flashcards[currentCardIndex]} />
        )}

        {/* Navigation */}
        <div className="flex gap-4 items-center">
          <Button
            onClick={() => setCurrentCardIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentCardIndex === 0}
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600">
            {currentCardIndex + 1} / {flashcards.length}
          </span>

          <Button
            onClick={() =>
              setCurrentCardIndex((prev) =>
                Math.min(prev + 1, flashcards.length - 1),
              )
            }
            disabled={currentCardIndex === flashcards.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Back */}
      <div className="mb-4">
        <Link
          to={`/documents/${documentId}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Document
        </Link>
      </div>

      {/* Header */}
      <PageHeader title="Flashcards">
        <div className="flex gap-3">
          {!loading &&
            (flashcards.length > 0 ? (
              <Button
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={deleting}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                <Trash2 size={16} />
                Delete Set
              </Button>
            ) : (
              <Button
                onClick={handleGenerateFlashcards}
                disabled={generating}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                {generating ? (
                  <Spinner />
                ) : (
                  <>
                    <Plus size={16} />
                    Generate Flashcards
                  </>
                )}
              </Button>
            ))}
        </div>
      </PageHeader>

      {/* Content */}
      <div className="mt-6">{renderFlashcardContent()}</div>

      {/* Modal */}
      {isDeleteModalOpen && (
        <Modal>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this flashcard set?
            </p>

            <div className="flex justify-end gap-3">
              <Button onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>

              <Button
                onClick={handleDeleteFlashcardSet}
                disabled={deleting}
                className="bg-red-500 text-white"
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FlashcardsPage;
