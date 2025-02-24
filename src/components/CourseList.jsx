import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react'; 
import { fetchCourses, setSearchQuery, markCourseComplete } from '../redux/coursesSlice';

const CourseList = () => {
  const dispatch = useDispatch();
  const { courses, enrolledCourses, searchQuery, status } = useSelector(state => state.courses);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        await dispatch(fetchCourses({ 
          pageNo: currentPage, 
          institution: 'Yale University' 
        })).unwrap();
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };

    loadCourses();
  }, [dispatch, currentPage]);

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.institution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(course => course.id === courseId);
  };
  const isCompleted = (courseId) => {
    const enrolledCourse = enrolledCourses.find(course => course.id === courseId);
    return enrolledCourse ? enrolledCourse.completed : false;
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">Failed to load courses. Please try again later.</span>
          <button 
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => dispatch(fetchCourses({ pageNo: currentPage, institution: 'Yale University' }))}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search courses or institutions..."
          className="w-full p-2 border rounded"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>
      
      {filteredCourses.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          No courses found. Try adjusting your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            const enrolled = isEnrolled(course.id);
            
            return (
              <Link to={`/course/${course.id}`} key={course.id}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img 
                      src="https://img.freepik.com/free-vector/online-tutorials-concept_23-2148529958.jpg" 
                      alt={course.name} 
                      className="w-full h-48 object-cover" 
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=Course+Image";
                      }}
                    />
                    <div className="absolute top-2 right-2"> 
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded ${
  isCompleted(course.id) 
    ? 'bg-green-500 text-white'  
    : isEnrolled(course.id) 
      ? 'bg-yellow-500 text-white' 
      : 'bg-blue-500 text-white'   
}`}>
  {isCompleted(course.id) ? 'Completed' : isEnrolled(course.id) ? 'In Progress' : 'Open'}
</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-1">{course.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">by {course.instructor}</p>
                    
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={14} />
                          {course.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart 
                          fill="red" 
                          size={16} 
                          className="text-red-500" 
                        />
                        <span className="text-sm text-gray-600">{course.likes}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">{course.duration}</span>
                      <span className="text-sm text-gray-500">{course.schedule}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex justify-center gap-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CourseList;