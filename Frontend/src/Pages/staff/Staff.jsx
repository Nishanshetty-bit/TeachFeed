import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApexCharts from 'apexcharts';

const Staff = () => {
  const [teachers, setTeachers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRatings, setAverageRatings] = useState({
    q1: 0, q2: 0, q3: 0, q4: 0, q5: 0,
    overall: 0
  });
  const [currentTeacher, setCurrentTeacher] = useState({
    name: 'Unknown',
    subject: 'Unknown'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, reviewsRes] = await Promise.all([
          axios.get('http://localhost:8081/teachers'),
          axios.get('http://localhost:8081/question')
        ]);
        
        setTeachers(teachersRes.data || []);
        setReviews(reviewsRes.data || []);
        
        // Set the first teacher as default if available
        if (teachersRes.data && teachersRes.data.length > 0) {
          const firstTeacher = teachersRes.data[0];
          setCurrentTeacher({
            name: firstTeacher.name || 'Unknown',
            subject: firstTeacher.subject || 'Unknown'
          });
        }
        
        // Calculate averages after data is loaded
        calculateAverages(reviewsRes.data || []);
      } catch (err) {
        setError('Failed to load data');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateAverages = (reviewsData) => {
    if (!reviewsData || reviewsData.length === 0) return;

    // Calculate average for each question
    const calculateAverage = (question) => {
      const validReviews = reviewsData.filter(r => !isNaN(parseFloat(r[question])));
      if (validReviews.length === 0) return 0;
      const sum = validReviews.reduce((acc, curr) => acc + parseFloat(curr[question]), 0);
      return sum / validReviews.length;
    };

    const q1Avg = calculateAverage('q1');
    const q2Avg = calculateAverage('q2');
    const q3Avg = calculateAverage('q3');
    const q4Avg = calculateAverage('q4');
    const q5Avg = calculateAverage('q5');
    const overallAvg = (q1Avg + q2Avg + q3Avg + q4Avg + q5Avg) / 5;

    setAverageRatings({
      q1: q1Avg,
      q2: q2Avg,
      q3: q3Avg,
      q4: q4Avg,
      q5: q5Avg,
      overall: overallAvg
    });
  };

  useEffect(() => {
    if (!loading && reviews.length > 0) {
      renderChart();
    }
  }, [loading, reviews, averageRatings]);

  const renderChart = () => {
    const options = {
      series: [{
        name: 'Average Ratings',
        data: [
          averageRatings.q1,
          averageRatings.q2,
          averageRatings.q3,
          averageRatings.q4,
          averageRatings.q5
        ].map(avg => parseFloat(avg.toFixed(1)))
      }],
      chart: {
        type: 'bar',
        height: 250,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          columnWidth: '60%',
        },
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: ['Punctuality', 'Clarity', 'Doubt Solving', 'Real World Examples', 'Interaction'],
        axisTicks: { show: false },
        axisBorder: { show: false },
        labels: {
          style: {
            colors: '#6B7280',
            fontSize: '14px'
          }
        }
      },
      yaxis: {
        max: 5,
        show: false
      },
      grid: {
        show: false
      },
      colors: ['#1A56DB'],
      tooltip: {
        enabled: true,
        y: {
          formatter: (val) => val.toFixed(1)
        }
      }
    };

    const chartElement = document.querySelector("#rating-chart");
    if (chartElement) {
      chartElement.innerHTML = '';
      const chart = new ApexCharts(chartElement, options);
      chart.render();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center me-3">
            <svg className="w-6 h-6 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 19">
              <path d="M14.5 0A3.987 3.987 0 0 0 11 2.1a4.977 4.977 0 0 1 3.9 5.858A3.989 3.989 0 0 0 14.5 0ZM9 13h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z"/>
              <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z"/>
            </svg>
          </div>
          <div>
            <h5 className="leading-none text-3xl font-bold text-gray-900 pb-1">
              {averageRatings.overall.toFixed(1)}
            </h5>
            <p className="text-sm font-normal text-gray-500">
              {currentTeacher.name} - {currentTeacher.subject}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-500 text-sm">Teacher: {currentTeacher.name}</span>
          <span className="text-gray-500 text-sm">Subject: {currentTeacher.subject}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">Total teachers: {teachers.length}</span>
          <span className="text-gray-500 text-sm">Total reviews: {reviews.length}</span>
        </div>
      </div>

      <div id="rating-chart" className="mb-6"></div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        {/* Optional: Add back the dropdown if needed */}
      </div>
    </div>
  );
};

export default Staff;