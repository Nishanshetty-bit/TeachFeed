import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SelectPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [loginType] = useState(location.state?.loginType || '');

  // Redirect if not student
  useEffect(() => {
    if (loginType !== 'student') {
      navigate('/unauthorized');
    }
  }, [loginType, navigate]);

  useEffect(() => {
    axios.get("http://localhost:8081/")
      .then((res) => {
        setTeachers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/teachers", { state: { branch, semester } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="relative isolate px-6 lg:px-8 min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl py-12">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Select Faculty Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Select Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                <option value="">Choose a branch</option>
                <option value="CSE">CSE</option>
                <option value="ISE">ISE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="CS-DS">CS-DS</option>
                <option value="CE">CE</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Select Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                <option value="">Choose a semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
            >
              View Teachers
            </button>
          </form>
        </div>

        {/* <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            All Teachers
          </h2>
          
          {teachers.length === 0 ? (
            <p className="text-center text-gray-500">No teachers found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher, index) => (
                <div
                  onClick={() => navigate(`/feedback/${teacher.id}`, { state: { teacher } })}
                  key={index}
                  className="bg-blue-100 flex flex-col items-center gap-2 rounded-lg p-6 shadow hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                >
                  <div className="bg-blue-200 h-48 w-48 rounded-full overflow-hidden border-4 border-indigo-300">
                    <img
                      className="object-cover w-full h-full"
                      src={teacher.image}
                      alt={teacher.name}
                    />
                  </div>
                  <h1 className="text-xl font-semibold text-gray-900 mt-4">
                    {teacher.name}
                  </h1>
                  <p className="text-lg text-gray-600">{teacher.subject}</p>
                </div>
              ))}
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}

export default SelectPage;