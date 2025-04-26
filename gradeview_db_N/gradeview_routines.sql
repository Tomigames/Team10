-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: gradeview
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping routines for database 'gradeview'
--
/*!50003 DROP PROCEDURE IF EXISTS `add_assessment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_assessment`(IN UserID int,IN CourseID int, IN WeightID int, IN AssessmentName varchar(100), IN IndividualGrade Decimal(10,0))
BEGIN
	INSERT INTO assessment
		(UserID, CourseID, WeightID, AssessmentName, IndividualGrade)
        VALUES (UserID, CourseID, WeightID, AssessmentName, IndividualGrade);
        
	CALL update_overallcoursegrade(UserID,CourseID);
    CALL update_courseGPA(UserID,CourseID);
    CALL update_comprehensiveGPA(UserID);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `add_course` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_course`(IN pUserID int, IN pCourseName varchar(50), IN pInstructor varchar(50), IN pSemester varchar(50), IN pYear int, IN pCreditHours int)
BEGIN

INSERT INTO course
		(UserID, CourseName, Instructor, Semester, Year, OverallGrade, GPA, CreditHours)
        VALUES (pUserID, pCourseName, pInstructor, pSemester, pYear, 0, 0, pCreditHours);

CALL update_CompletedCredits(pUserID);
CALL update_Standing(pUserID); 
CALL update_comprehensiveGPA(pUserID);

END ;;
DELIMITER ;

/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `add_weight` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;

DELIMITER ;;
CREATE DEFINER = `root`@`localhost` PROCEDURE add_weight(IN pUserID int, IN pCourseID int, IN pAssessmentType varchar(50), IN pWeightPercentage decimal(10,0))
BEGIN 
	INSERT INTO weight (UserID, CourseID, AssessmentType, WeightPercentage) VALUES (pUserID, pCourseID, pAssessmentType, pWeightPercentage);
END ;;
DELIMITER ;

/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `delete_assessment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_assessment`(IN pAssessmentID int, IN pUserID int, IN pCourseID int)
BEGIN
	DELETE FROM assessment WHERE AssessmentID = pAssessmentID;
    
    CALL update_overallcoursegrade(pUserID,pCourseID);
    CALL update_courseGPA(pUserID,pCourseID);
    CALL update_comprehensiveGPA(pUserID);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `delete_course` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_course`(IN pUserID int, IN pCourseID int)
BEGIN
    
	DELETE FROM course
    WHERE UserID = pUserID and CourseID = pCourseID;
    
    CALL update_CompletedCredits(pUserID);
	CALL update_Standing(pUserID); 
    CALL update_comprehensiveGPA(pUserID);
END ;;
DELIMITER ;

/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `delete_weight` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;

DELIMITER ;;

CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_weight`(
  IN pUserID           INT,
  IN pCourseID         INT,
  IN pAssessmentType   VARCHAR(50)
)
BEGIN
  DECLARE vWeightID INT DEFAULT NULL;

  START TRANSACTION;

  -- 1) Fetch the one WeightID
  SELECT WeightID
    INTO vWeightID
    FROM weight
   WHERE UserID         = pUserID
     AND CourseID       = pCourseID
     AND AssessmentType = pAssessmentType
   LIMIT 1;

  -- 2) If found, delete its assessments…
  IF vWeightID IS NOT NULL THEN
    DELETE FROM assessment
     WHERE WeightID = vWeightID;
     
	CALL update_overallcoursegrade(pUserID,pCourseID);
    CALL update_courseGPA(pUserID,pCourseID);
    CALL update_comprehensiveGPA(pUserID);

    -- 3) …then delete the weight row
    DELETE FROM weight
     WHERE WeightID = vWeightID;
  END IF;

  COMMIT;
  
  
  
END ;;

DELIMITER ;






/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_assessment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_assessment`(IN pAssessmentID int,IN pUserID int,IN pCourseID int, IN pWeightID int, IN pAssessmentName varchar(100), IN pIndividualGrade Decimal(10,0))
BEGIN
	UPDATE assessment
    SET 
		UserID = pUserID,
        CourseID = pCourseID,
        WeightID = pWeightID,
        AssessmentName = pAssessmentName,
        IndividualGrade = pIndividualGrade
	WHERE AssessmentID = pAssessmentID AND UserID = pUserID AND CourseID = pCourseID;
    
    CALL update_overallcoursegrade(pUserID,pCourseID);
    CALL update_courseGPA(pUserID,pCourseID);
    CALL update_comprehensiveGPA(pUserID);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_CompletedCredits` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_CompletedCredits`(IN pUserID int)
BEGIN
DECLARE currentCreditsCompleted INT DEFAULT 0;

UPDATE transcript
SET CreditsCompleted = 
	(SELECT SUM(CreditHours)
	FROM course
	WHERE UserID = pUserID)
WHERE UserID = pUserID;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_comprehensiveGPA` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_comprehensiveGPA`(IN pUserID int)
BEGIN
	DECLARE TotalGradePoints DECIMAL(10,2) DEFAULT 0.0;
    DECLARE TotalCreditHours INT DEFAULT 0;
    
    SELECT SUM(GPA * CreditHours)
    INTO TotalGradePoints
    FROM course
    WHERE UserID = pUserID;
    
	SELECT CreditsCompleted
    INTO TotalCreditHours
    FROM transcript
    WHERE UserID = pUserID;
    
    UPDATE transcript
    SET CumulativeGPA = TotalGradePoints/TotalCreditHours;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_course` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_course`(IN pUserID int, IN pCourseID int, IN pCourseName varchar(50), IN pInstructor varchar(50), IN pSemester varchar(50), IN pYear int, IN pCreditHours int)
BEGIN
UPDATE course
SET CourseName = pCourseName,
	Instructor = pInstructor,
	Semester = pSemester,
	Year = pYear,
	CreditHours = pCreditHours
WHERE UserID = pUserID and CourseID = pCourseID;
    
CALL update_CompletedCredits(pUserID);
CALL update_Standing(pUserID); 
CALL update_comprehensiveGPA(pUserID);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_courseGPA` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_courseGPA`(IN pUserID int, IN pCourseID int)
BEGIN
	DECLARE CourseGrade DECIMAL(10,2) DEFAULT 0.0;
    DECLARE gpa DECIMAL(10,2) DEFAULT 0.0;
    
    SELECT OverallGrade 
    INTO CourseGrade
    FROM course c
    WHERE c.CourseID = pCourseID AND c.UserID = pUserID;
    
    IF CourseGrade > (SELECT Amin FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) THEN
		SET gpa = 4.00;
	ELSEIF CourseGrade < (SELECT Amin FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) 
		AND CourseGrade > (SELECT Aminus_min FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) THEN
			SET gpa = 3.67;
	ELSEIF CourseGrade < (SELECT Aminus_min FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) 
		AND CourseGrade > (SELECT Bplus_min FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) THEN
			SET gpa = 3.33;
	ELSEIF CourseGrade < (SELECT Bplus_min FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) 
		AND CourseGrade > (SELECT Bmin FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) THEN
			SET gpa = 3.00;
	ELSEIF CourseGrade < (SELECT Bmin FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) 
		AND CourseGrade > (SELECT Bminus_min FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) THEN
			SET gpa = 2.67;
	ELSEIF CourseGrade < (SELECT Bminus_min FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) 
		AND CourseGrade > (SELECT Cplus_min FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) THEN
			SET gpa = 2.33;
	ELSEIF CourseGrade < (SELECT Cplus_min FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) 
		AND CourseGrade > (SELECT Cmin FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) THEN
			SET gpa = 2.00;
	ELSEIF CourseGrade < (SELECT Cmin FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) 
		AND CourseGrade > (SELECT Cminus_min FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) THEN
			SET gpa = 1.67;
	ELSEIF CourseGrade < (SELECT Cminus_min FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) 
		AND CourseGrade > (SELECT Dplus_min FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) THEN
			SET gpa = 1.33;
	ELSEIF CourseGrade < (SELECT Dplus_min FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) 
		AND CourseGrade > (SELECT Dmin FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) THEN
			SET gpa = 1.00;
	ELSEIF CourseGrade < (SELECT Dmin FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) 
		AND CourseGrade > (SELECT Dminus_min FROM grading_scale WHERE CourseID = CourseID AND UserID = UserID) THEN
			SET gpa = 0.67;
	ELSE
		SET gpa = 0;
        
	END IF;
    
    UPDATE course
    SET GPA = gpa
    WHERE UserID = pUserID AND CourseID = pCourseID;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_overallcoursegrade` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_overallcoursegrade`(IN pUserID int, IN pCourseID int)
BEGIN
	DECLARE CalculatedAvg DECIMAL(10,2) DEFAULT 0.0;
	
	SELECT 
    CAST(SUM((WeightedGrade / WeightedTotal) * subquery.WeightPercentage) AS DECIMAL(10,2))
INTO CalculatedAvg FROM
    (SELECT 
        SUM(IndividualGrade) AS WeightedGrade,
            COUNT(DISTINCT assessmentID) * 100 AS WeightedTotal,
            weight.WeightPercentage
    FROM
        assessment
    JOIN weight ON assessment.WeightID = weight.WeightID
        AND assessment.UserID = weight.UserID
    GROUP BY assessment.WeightID , weight.WeightPercentage) AS subquery;

	UPDATE course
    SET OverallGrade = CalculatedAvg
    WHERE UserID = pUserID AND CourseID = pCourseID;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_Standing` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_Standing`(IN pUserID int)
BEGIN

DECLARE currentCreditsCompleted INT DEFAULT 0;
DECLARE newStanding varchar(50) DEFAULT 'Freshman';

SELECT CreditsCompleted
into currentCreditsCompleted
FROM transcript
WHERE UserID = pUserID;
SELECT currentCreditsCompleted;
IF currentCreditsCompleted < 30 THEN
	SET newStanding = 'Freshman';
ELSEIF currentCreditsCompleted > 30 AND currentCreditsCompleted < 53 THEN 
	SET newStanding = 'Sophomore';
ELSEIF currentCreditsCompleted > 53 AND currentCreditsCompleted < 89 THEN 
	SET newStanding = 'Junior';
ELSE 
	SET newStanding = 'Senior';
    
END IF;
Select newStanding;
UPDATE transcript
SET Standing = newStanding
WHERE UserID = pUserID;

END ;;
DELIMITER ;

/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_weight` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
 
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_weight`(
    IN pWeightID INT,
    IN pUserID INT,
    IN pCourseID INT,
    IN pAssessmentType VARCHAR(50),
    IN pNewWeight DECIMAL(10,0)
)
BEGIN
    DECLARE TotalWeight DECIMAL(10,0) default 0;
 
    -- Calculate total weight excluding the one we're updating
    SELECT 
        IFNULL(SUM(WeightPercentage), 0)
    INTO TotalWeight
    FROM weight
    WHERE UserID = pUserID 
      AND CourseID = pCourseID 
      AND WeightID != pWeightID;

    -- Check if new total would exceed 100
    IF TotalWeight + pNewWeight > 100 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Total weight percentage cannot exceed 100%.';
    ELSE
        UPDATE weight
        SET 
            AssessmentType = pAssessmentType,
            WeightPercentage = pNewWeight
        WHERE 
            WeightID = pWeightID 
            AND UserID = pUserID 
            AND CourseID = pCourseID;
    END IF;
END ;;
DELIMITER ;


/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-22 12:53:18
