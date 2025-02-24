const API_KEY = 'b722ae9ab7msh30f611f658b9801p1c0bcbjsn7e3f3cd670a6';
const API_HOST = 'collection-for-coursera-courses.p.rapidapi.com';

export const fetchCoursesFromAPI = async (pageNo = 1, institution = 'Yale University') => {
    try {
      const response = await fetch(
        `https://collection-for-coursera-courses.p.rapidapi.com/rapidapi/course/get_course.php?page_no=${pageNo}&course_institution=${encodeURIComponent(institution)}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-host': API_HOST,
            'x-rapidapi-key': API_KEY,
          }
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (!data.reviews) {
        console.log('API Response:', data); 
        return [];
      }
  
      return data.reviews; 
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  };