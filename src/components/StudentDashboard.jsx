import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markCourseComplete } from '../redux/coursesSlice';
import { motion } from 'framer-motion';
import { toggleLikeCourse } from '../redux/coursesSlice';
import { Heart } from 'lucide-react';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const enrolledCourses = useSelector(state => state.courses.enrolledCourses);
  const mainCourses = useSelector(state => state.courses.courses);

  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🎓 My Enrolled Courses</h2>
      
      {enrolledCourses.length === 0 ? (
        <p className="text-gray-500">You are not enrolled in any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map(course => {
            const mainCourse = mainCourses.find(c => c.id === course.id);
            const likesCount = mainCourse ? mainCourse.likes : 0;
            
            return (
              <motion.div 
                key={course.id} 
                whileHover={{ scale: 1.03 }} 
                className="bg-white shadow-lg rounded-2xl overflow-hidden transition transform"
              >
                <img 
                  src="https://img.freepik.com/free-vector/online-tutorials-concept_23-2148529958.jpg" 
                  alt={course.name} 
                  className="w-full h-40 object-cover" 
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300?text=Course+Image"; 
                  }}
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">👨‍🏫 Instructor: {course.instructor}</p>
                  <p className="text-gray-500 text-sm mb-3">📅 Due Date: {course.dueDate || 'No due date'}</p>

                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        className={`h-3 rounded-full ${course.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                        initial={{ width: '0%' }}
                        animate={{ width: `${course.completed ? 100 : course.progress || 50}%` }}
                        transition={{ duration: 0.5 }}
                      ></motion.div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{course.progress || 50}% Completed</p>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => dispatch(toggleLikeCourse(course.id))}
                        className={`flex items-center gap-2 ${
                          course.liked ? 'text-red-500' : 'text-gray-400'
                        }`}
                      >
                        <Heart fill={course.liked ? 'red' : 'none'} className="w-5 h-5" />
                        {course.liked ? 'Liked' : 'Like'}
                      </button>

                      <p className="text-gray-700 font-semibold">{likesCount} Likes</p>
                    </div>
                  </div>

                  <button
                    onClick={() => dispatch(markCourseComplete(course.id))}
                    className={`w-full py-2 rounded-lg font-medium transition ${
                      course.completed
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    disabled={course.completed}
                  >
                    {course.completed ? '✅ Completed' : 'Mark as Complete'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;