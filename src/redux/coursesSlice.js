import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCoursesFromAPI } from '../api/courseAPI';

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async ({ pageNo, institution }, { rejectWithValue, getState }) => {
    try {
      const courses = await fetchCoursesFromAPI(pageNo, institution);
      const currentCourses = getState().courses.courses;
      
      return courses.map(course => {
        const existingCourse = currentCourses.find(c => c.course_id === course.course_id || c.id === course.course_id);
        
        return {
          id: course.course_id || String(Math.random()),
          name: course.course_name || 'Untitled Course',
          institution: course.course_institution || 'Yale University',
          url: course.course_url || '#',
          uniqueId: course.course_unique_id || '',
          instructor: 'Yale Faculty',
          description: 'Course offered by Yale University through Coursera platform.',
          enrollmentStatus: 'Open',
          thumbnail: '/api/placeholder/400/300',
          duration: '8 weeks',
          schedule: 'Flexible',
          location: 'Online',
          likes: existingCourse ? existingCourse.likes : 0,
          prerequisites: ['Basic JavaScript knowledge', 'Familiarity with React'],
          syllabus: [
            { week: 1, topic: 'Introduction', content: 'Course introduction and overview' },
            { week: 2, topic: 'React Native', content: 'Overview of React Native, setting up your development environment.' },
            { week: 3, topic: 'Building Your First App', content: 'Creating a simple mobile app using React Native components.' },
            { week: 4, topic: 'Testing Your App', content: 'Going to test your app using the online software' },
            { week: 5, topic: 'Deployment', content: 'Start the Deployment of your first project' }
          ]
        };
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    enrolledCourses: [],
    status: 'idle',
    error: null,
    searchQuery: '',
    currentPage: 1
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    enrollCourse: (state, action) => {
      const courseToEnroll = action.payload;
      if (!state.enrolledCourses.find(course => course.id === courseToEnroll.id)) {
        const mainCourse = state.courses.find(c => c.id === courseToEnroll.id);
        const likesCount = mainCourse ? mainCourse.likes : 0;
        
        state.enrolledCourses.push({
          ...courseToEnroll,
          progress: 0,
          completed: false,
          enrollmentDate: new Date().toISOString(),
          liked: false,
        });
      }
    },
    markCourseComplete: (state, action) => {
      const course = state.enrolledCourses.find(c => c.id === action.payload);
      if (course) {
        course.completed = true;
        course.progress = 100;
      }
      const mainCourse=state.courses.find(c=>c.id === action.payload);
      if(mainCourse){
        mainCourse.completed=true;
      }
    },
    toggleLikeCourse: (state, action) => {
      const courseId = action.payload;
      const enrolledCourse = state.enrolledCourses.find(c => c.id === courseId);
      
      if (enrolledCourse) {
        enrolledCourse.liked = !enrolledCourse.liked;
        const mainCourse = state.courses.find(c => c.id === courseId);
        if (mainCourse) {
          mainCourse.likes += enrolledCourse.liked ? 1 : -1;
        }
      }
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedCourses = action.payload;
        updatedCourses.forEach(newCourse => {
          const existingCourseIndex = state.courses.findIndex(c => c.id === newCourse.id);
          if (existingCourseIndex >= 0) {
            const existingLikes = state.courses[existingCourseIndex].likes;
            state.courses[existingCourseIndex] = {
              ...newCourse,
              likes: existingLikes 
            };
          } else {
            state.courses.push(newCourse);
          }
        });
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const {
  setSearchQuery,
  enrollCourse,
  markCourseComplete,
  toggleLikeCourse,
  setCurrentPage
} = coursesSlice.actions;

export default coursesSlice.reducer;