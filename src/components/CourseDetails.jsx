import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { enrollCourse } from '../redux/coursesSlice';

const CourseDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [expandedWeek, setExpandedWeek] = useState(null);
  
  const course = useSelector(state => 
    state.courses.courses.find(c => String(c.id) === id)
  );

  const enrolledCourses = useSelector(state => state.courses.enrolledCourses);
  const isEnrolled = enrolledCourses.some(c => c.id === course?.id);

  if (!course) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <img 
          src="https://img.freepik.com/free-vector/online-tutorials-concept_23-2148529958.jpg" 
          alt={course.name} 
          className="w-full h-48 object-cover" 
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=Course+Image"; 
          }}
        />
        <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <p className="text-xl mb-2">Instructor: {course.instructor}</p>
          <p className="text-gray-600 mb-4">{course.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold">Duration</h3>
              <p>{course.duration}</p>
            </div>
            <div>
              <h3 className="font-semibold">Schedule</h3>
              <p>{course.schedule}</p>
            </div>
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{course.location}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{course.enrollmentStatus}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Prerequisites</h3>
            <ul className="list-disc list-inside">
              {course.prerequisites.map((prereq, index) => (
                <li key={index}>{prereq}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Syllabus</h3>
            {course.syllabus.map((week) => (
              <div key={week.week} className="border-b last:border-b-0 py-2">
                <button
                  className="w-full text-left flex justify-between items-center"
                  onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)}
                >
                  <span className="font-medium">Week {week.week}: {week.topic}</span>
                  <span>{expandedWeek === week.week ? '−' : '+'}</span>
                </button>
                {expandedWeek === week.week && (
                  <p className="mt-2 text-gray-600 pl-4">{week.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {isEnrolled ? (
          <p className="text-green-600 text-lg font-semibold text-center">
            ✅ You have successfully enrolled in this course!
          </p>
        ) : (
          <button
            onClick={() => dispatch(enrollCourse(course))}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full"
          >
            Enroll Now
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
