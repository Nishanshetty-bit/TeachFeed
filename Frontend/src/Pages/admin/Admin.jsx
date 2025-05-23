import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase-config";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("addFaculty");
  const [name, setName] = useState("");
  const [sub, setSub] = useState("");
  const [url, setUrl] = useState("https://thumbs.dreamstime.com/b/eyeglasses-bearded-asian-man-relaxed-standing-d-vector-avatar-illustration-cheerful-mature-male-cartoon-character-face-confident-297508057.jpg");
  const { register, handleSubmit, reset } = useForm();
  const [success, setSuccess] = useState(0);
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && activeTab === 'viewFaculty') {
      fetchFacultyData();
    }
  }, [user, activeTab]);

  const fetchFacultyData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/teachers');
      setFacultyList(response.data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
      alert("Failed to load faculty data");
    }
  };

  const handleSubmitform = async (data) => {
    try {
      const teacherData = {
        id: data.id,
        Name: data.name,
        Subject: data.subject,
        Department: data.department,
        image: data.img,
        Semester: data.semester
      };

      await axios.post('http://localhost:8081/teachers', teacherData);
      
      reset();
      setSuccess(1);
      setName("");
      setSub("");
      setUrl("https://thumbs.dreamstime.com/b/eyeglasses-bearded-asian-man-relaxed-standing-d-vector-avatar-illustration-cheerful-mature-male-cartoon-character-face-confident-297508057.jpg");
      
      if (activeTab === 'viewFaculty') {
        await fetchFacultyData();
      }
    } catch (error) {
      console.error("Error adding faculty:", error);
      alert("Failed to add teacher: " + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteFaculty = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/teachers/${id}`);
      await fetchFacultyData();
      alert("Teacher deleted successfully");
    } catch (error) {
      console.error("Error deleting faculty:", error);
      alert("Failed to delete teacher");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 ${success ? "" : "hidden"}`}>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-xl font-semibold mb-4">TEACHER ADDED SUCCESSFULLY</p>
          <button 
            onClick={() => setSuccess(0)} 
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            OK
          </button>
        </div>
      </div>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-7xl py-12">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl pb-8 text-center">Admin Dashboard</h1>
          
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('addFaculty')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'addFaculty' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Add Faculty
            </button>
            <button
              onClick={() => setActiveTab('viewFaculty')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'viewFaculty' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              View Faculty
            </button>
          </div>

          {activeTab === 'addFaculty' && (
            <div className="flex flex-col md:flex-row gap-8">
              <form className="w-full md:w-1/2 flex flex-col gap-6" onSubmit={handleSubmit(handleSubmitform)}>
                <div className="w-full flex items-center gap-5">
                  <span className="text-lg font-medium text-gray-900">Faculty Name:</span>
                  <input
                    {...register("name", { required: true })} 
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white h-12 w-full max-w-md rounded-full px-4 outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-600"
                    type="text"
                    placeholder="Name"
                  />
                </div>
                
                <div className="w-full flex items-center gap-5">
                  <span className="text-lg font-medium text-gray-900 pr-[5%]">Faculty ID:</span>
                  <input
                    {...register("id", { required: true })} 
                    className="bg-white h-12 w-full max-w-md rounded-full px-4 outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-600"
                    type="text"
                    placeholder="ID"
                  />
                </div>

                <div className="w-full flex items-center gap-5">
                  <span className="text-lg mr-3 font-medium text-gray-900">Department:</span>
                  <select
                    {...register("department", { required: true })}
                    className="bg-white w-full max-w-md outline-none rounded-full px-4 h-12 border border-gray-300 focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ISE">ISE</option>
                    <option value="ECE">ECE</option>
                    <option value="AI&ML">AI&ML</option>
                    <option value="DSE">AI&DS</option>
                    <option value="MEC">ME</option>
                    <option value="CIV">CV</option>
                  </select>
                </div>

                <div className="w-full flex items-center gap-5">
                  <span className="text-lg mr-8 font-medium text-gray-900">Semester:</span>
                  <select
                    {...register("semester", { required: true })}
                    className="bg-white w-full max-w-md outline-none rounded-full px-4 h-12 border border-gray-300 focus:ring-2 focus:ring-indigo-600"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div className="w-full flex items-center gap-5">
                  <span className="text-lg mr-1 font-medium text-gray-900">Subject Code:</span>
                  <input
                    {...register("subject", { required: true })}
                    onChange={(e) => setSub(e.target.value)}
                    className="bg-white h-12 w-full max-w-md rounded-full px-4 outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-600"
                    type="text"
                    placeholder="Code"
                  />
                </div>

                <div className="w-full flex items-center gap-5">
                  <span className="text-lg font-medium text-gray-900">Profile Pic URL:</span>
                  <input
                    {...register("img", { required: true })}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-white h-12 w-full max-w-md rounded-full px-4 outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-600"
                    type="text"
                    placeholder="URL"
                  />
                </div>

                <div className="w-full flex justify-center mt-6">
                  <input 
                    className="bg-indigo-600 w-40 rounded-full py-3 px-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer" 
                    type="submit" 
                    value="Submit" 
                  />
                </div>
              </form>

              <div className="w-full md:w-1/2 flex flex-col items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-6">PROFILE PREVIEW</h1>
                <div className="bg-white w-full max-w-xs flex flex-col items-center gap-2 rounded-lg p-6 shadow-lg">
                  <div className="bg-blue-200 h-48 w-48 rounded-full overflow-hidden border-4 border-indigo-100">
                    <img className="object-cover w-full h-full" src={url} alt="Profile" />
                  </div>
                  <h1 className="text-xl font-semibold text-gray-900 mt-4">Name: {name || "Not specified"}</h1>
                  <h1 className="text-lg text-gray-600">Subject: {sub || "Not specified"}</h1>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'viewFaculty' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {facultyList.map((faculty) => (
                      <tr key={faculty.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img className="h-10 w-10 rounded-full" src={faculty.image} alt={faculty.Name} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {faculty.Name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {faculty.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {faculty.Department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {faculty.Semester}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {faculty.Subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteFaculty(faculty.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;