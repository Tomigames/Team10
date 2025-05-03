/**
 * Utility functions for grade calculations
 */

/**
 * Calculate the average grade for a section of assessments
 * @param {Array} assessments - Array of assessment objects with individualGrade property
 * @returns {number} - The average grade for the section
 */
export const calculateSectionAverage = (assessments) => {
  if (!assessments || assessments.length === 0) return 0;
  
  let total = 0;
  let count = 0;
  
  assessments.forEach(assessment => {
    const grade = parseFloat(assessment.IndividualGrade);
    if (!isNaN(grade)) {
      total += grade;
      count++;
    }
  });
  
  return count > 0 ? total / count : 0;
};

/**
 * Calculate the overall course grade based on weighted section averages
 * @param {Object} courseData - Course data with weights and assessments
 * @returns {number} - The overall course grade
 */
export const calculateOverallGrade = (courseData) => {
  if (!courseData || !courseData.weights || !courseData.assessments) return 0;
  
  let totalWeightedGrade = 0;
  let totalWeight = 0;
  
  // Group assessments by weight type
  const assessmentsByWeight = {};
  courseData.assessments.forEach(assessment => {
    if (!assessmentsByWeight[assessment.WeightID]) {
      assessmentsByWeight[assessment.WeightID] = [];
    }
    assessmentsByWeight[assessment.WeightID].push(assessment);
  });
  
  // Calculate weighted average for each section
  courseData.weights.forEach(weight => {
    const sectionAssessments = assessmentsByWeight[weight.WeightID] || [];
    const sectionAverage = calculateSectionAverage(sectionAssessments);
    const weightPercentage = parseFloat(weight.WeightPercentage) || 0;
    
    totalWeightedGrade += sectionAverage * (weightPercentage / 100);
    totalWeight += weightPercentage;
  });
  
  // If total weight is 0, return 0 to avoid division by zero
  const result = totalWeight > 0 ? totalWeightedGrade : 0;
  
  // Ensure the result is a number
  return isNaN(result) ? 0 : result;
};

/**
 * Get the color class for a grade
 * @param {number} grade - The grade value
 * @returns {string} - The color class name
 */
export const getGradeColor = (grade) => {
  // Ensure grade is a number
  const numericGrade = typeof grade === 'number' ? grade : 0;
  
  if (numericGrade >= 85) return 'green';
  if (numericGrade >= 70) return 'yellow';
  if (numericGrade > 0) return 'red';
  return 'gray';
}; 