import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../Pages/firebase/firebase-config';
import axios from 'axios';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginType, setLoginType] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [staffId, setStaffId] = useState(''); // New field for staff ID
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setStaffId('');
    setError('');
  }, [loginType, isLogin]);

  const handleStaffLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8081/staff', {
        email,
        password
      });
      
      if (response.data.success) {
        navigate('/staff', { 
          state: { 
            loginType: 'staff',
            staffData: response.data.staff 
          } 
        });
      } else {
        throw new Error(response.data.message || 'Staff login failed');
      }
    } catch (err) {
      throw err;
    }
  };

  const handleStaffRegister = async () => {
    if (password !== confirmPassword) {
      throw new Error("Passwords don't match");
    }

    try {
      const response = await axios.post('http://localhost:8081/staff/register', {
        name: fullName,
        email,
        password
      });

      if (response.data.success) {
        alert('Staff account created successfully!');
        setIsLogin(true);
      } else {
        throw new Error(response.data.message || 'Staff registration failed');
      }
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (loginType === 'staff') {
        if (isLogin) {
          await handleStaffLogin();
        } else {
          await handleStaffRegister();
        }
      } else {
        // Existing Firebase logic for admin/student
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
          
          if (loginType === 'admin') {
            navigate('/admin', { state: { loginType } });
          } else {
            navigate('/select', { state: { loginType } });
          }
        } else {
          if (password !== confirmPassword) {
            throw new Error("Passwords don't match");
          }

          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          await setDoc(doc(db, 'users', user.uid), {
            fullName,
            email,
            userType: loginType,
            createdAt: new Date(),
          });

          alert('Account created successfully!');
          setIsLogin(true);
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className='flex items-center justify-center mt-18' >
      <div className= "max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        {isLogin ? 'Sign In' : 'Create Account'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setLoginType('student')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
              loginType === 'student' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setLoginType('staff')}
            className={`px-4 py-2 text-sm font-medium border-t border-b ${
              loginType === 'staff' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Staff
          </button>
          <button
            type="button"
            onClick={() => setLoginType('admin')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
              loginType === 'admin' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {!isLogin && loginType === 'staff' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Staff ID
              </label>
              <input
                type="text"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required

              />
            </div>
          </>
        )}

        {!isLogin && loginType !== 'staff' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
            placeholder='Enter your email'
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
            minLength="6"
            placeholder='Enter'
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
              minLength="6"
            />
          </div>
        )}

        {isLogin && (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-indigo-600 text-white py-2.5 rounded-lg ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : 
           isLogin ? (loginType === 'admin' ? 'Admin Login' : loginType === 'staff' ? 'Staff Login' : 'Student Login') : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-indigo-600 hover:text-indigo-500 font-medium"
        >
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </div>
    </div>
  </div>
  );
};

export default Login;