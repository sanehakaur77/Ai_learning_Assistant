import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import quizService from "../../services/quizService";
import Spinner from "../../components/common/Spinner";
import PageHeader from "../../components/common/PageHeader";
import toast from "react-hot-toast";
import { CheckCircle2, XCircle, Trophy } from "lucide-react";
import Header from "../../components/layout/Header";
const QuizResultPage = () => {
  const { quizId } = useParams();

  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await quizService.getQuizResults(quizId);
        setResultsData(res.data);
      } catch (error) {
        toast.error("Failed to load results");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Spinner />
      </div>
    );
  }

  if (!resultsData) {
    return (
      <div className="text-center mt-20 text-red-500">Results not found</div>
    );
  }

  const { quiz, results } = resultsData;

  const totalQuestions = quiz.totalQuestions;

  // Fix correct answer detection
  const correctAnswers = results.filter((r) => {
    const userAnswer = r.options[Number(r.selectedAnswer)];
    const cleanCorrectAnswer = r.correctAnswer.replace(/^\d+:\s*/, "");
    return userAnswer.trim() === cleanCorrectAnswer.trim();
  }).length;

  const incorrectAnswers = totalQuestions - correctAnswers;

  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  // Circular progress values
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (percentage / 100) * circumference;

  return (
    <>
      <Header></Header>
      <div className="max-w-4xl mx-auto p-6">
        <PageHeader title="Quiz Results" />

        {/* Score Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 mt-8 text-center">
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#e5e7eb"
                strokeWidth="10"
                fill="transparent"
              />

              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#10b981"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={progress}
                strokeLinecap="round"
              />
            </svg>

            {/* Trophy and percentage */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Trophy className="text-yellow-500 mb-1" size={32} />
              <span className="text-xl font-bold">{percentage}%</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-6">{quiz.title}</h2>

          {/* Stats */}
          <div className="flex justify-center gap-10 mt-6 text-sm">
            <div>
              <p className="text-gray-500">Correct</p>
              <p className="text-green-600 font-semibold text-lg">
                {correctAnswers}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Incorrect</p>
              <p className="text-red-500 font-semibold text-lg">
                {incorrectAnswers}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Total</p>
              <p className="text-gray-700 font-semibold text-lg">
                {totalQuestions}
              </p>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="space-y-6 mt-10">
          {results.map((q, index) => {
            const userAnswer = q.options[Number(q.selectedAnswer)];
            const cleanCorrectAnswer = q.correctAnswer.replace(/^\d+:\s*/, "");
            const isCorrect = userAnswer.trim() === cleanCorrectAnswer.trim();

            return (
              <div
                key={index}
                className="bg-white border rounded-xl p-6 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold">
                    {index + 1}. {q.question}
                  </h3>

                  {isCorrect ? (
                    <CheckCircle2 className="text-green-500" />
                  ) : (
                    <XCircle className="text-red-500" />
                  )}
                </div>

                <p className="text-sm mb-1">
                  Your Answer:
                  <span
                    className={`ml-2 font-medium ${
                      isCorrect ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {userAnswer}
                  </span>
                </p>

                {!isCorrect && (
                  <p className="text-sm text-green-600">
                    Correct Answer: {cleanCorrectAnswer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="text-center mt-10">
          <Link
            to="/quizzes"
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
          >
            Back to Quizzes
          </Link>
        </div>
      </div>
    </>
  );
};

export default QuizResultPage;
