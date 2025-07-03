// utils/courseUtils.js
export const getCourseProgress = (chapters) => {
  const total = chapters.length;
  const completed = chapters.filter(ch => ch.completed).length;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

  export const getLastAccessedChapter = (course) => {
    const last = course.chapters.findLast?.(ch => ch.completed);
    return last ? last.title : "Not started yet";
  };
  
  export function isCourseCompleted(course) {
    return course.chapters.every(chapter => chapter.completed === true);
  }
  