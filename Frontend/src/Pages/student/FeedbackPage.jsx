import { useLocation } from "react-router-dom";
import { useState } from "react";
import { feedbackQuestions } from '../questions';
import { useNavigate } from "react-router-dom";
import axios from "axios";

function FeedbackPage() {
  const { state } = useLocation();
  const teacher = state?.teacher;
  const [ratings, setRatings] = useState(
    Array(feedbackQuestions.length).fill(0)
  );
  const [activeQuestion, setActiveQuestion] = useState(0);
  const navigate = useNavigate();
  const ratingLabels = [
    "Bad",
    "Satisfactory",
    "Good",
    "Very Good",
    "Excellent",
  ];

  const handleRating = (index, value) => {
    const newRatings = [...ratings];
    newRatings[index] = value;
    setRatings(newRatings);
  };

  const onClickNext = () => {
    if (activeQuestion !== feedbackQuestions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    }
  };

  const onClickPrev = () => {
    if (activeQuestion !== 0) {
      setActiveQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const payload = {
      id: teacher.id,
      subject: teacher.subject,
      question: [...ratings],
    };
    axios
      .post("http://localhost:8081/question", payload)
      .then((res) => {
        console.log(res);
        navigate(`/thankyou`, {
          state: { teacher, ratings },
        });
      })
      .catch((err) => console.log(err));
  };

  const addLeadingZero = (number) => (number > 9 ? number : `0${number}`);

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8 min-h-screen">
      {/* Background gradient elements */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>

      <div className="mx-auto max-w-3xl py-12">
        <div className="rounded-xl bg-white/80 backdrop-blur-sm shadow-lg px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-4xl font-medium text-indigo-600">
                {addLeadingZero(activeQuestion + 1)}
              </span>
              <span className="text-[22px] font-medium text-gray-500">
                /{addLeadingZero(feedbackQuestions.length)}
              </span>
            </div>
          </div>

          <h3 className="my-4 text-2xl font-medium text-gray-900">
            {feedbackQuestions[activeQuestion]}
          </h3>

          <div className="space-y-4">
            {ratingLabels.map((label, index) => {
              const value = index + 1;
              return (
                <div
                  key={value}
                  onClick={() => handleRating(activeQuestion, value)}
                  className={`p-4 rounded-md cursor-pointer transition-colors ${
                    ratings[activeQuestion] === value
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-12">
            <button
              onClick={onClickPrev}
              disabled={activeQuestion === 0}
              className="min-w-[150px] transform cursor-pointer rounded-lg border border-indigo-600 px-5 py-2.5 text-lg font-semibold text-indigo-600 outline-none transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-600 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:border-gray-400 disabled:text-gray-400 disabled:hover:scale-100 disabled:hover:bg-transparent"
            >
              Previous
            </button>

            {activeQuestion === feedbackQuestions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={ratings[activeQuestion] === 0}
                className="min-w-[150px] transform cursor-pointer rounded-lg bg-indigo-600 px-5 py-2.5 text-lg font-semibold text-white outline-none transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:scale-100"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={onClickNext}
                disabled={ratings[activeQuestion] === 0}
                className="min-w-[150px] transform cursor-pointer rounded-lg bg-indigo-600 px-5 py-2.5 text-lg font-semibold text-white outline-none transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:scale-100"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom gradient element */}
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>
    </div>
  );
}

export default FeedbackPage;
