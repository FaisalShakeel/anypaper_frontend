import React, { createContext, useState, useEffect } from "react";
import axios from "axios"; // To make API requests
import { useOrderContext } from "./OrderContext";
import { fieldsOfStudy1, fieldsOfStudy2 } from "../constants/FieldsOfStudy";

// Create AuthContext
export const WriterPriceCalculationContext = createContext();

// AuthProvider component
export const WriterPriceCalculationProvider = ({ children }) => {
    const{fieldOfStudy}=useOrderContext()
    
  
    const pricingData = {
        HighSchool: [1.85, 1.8, 1.9, 2, 2.1, 2.1, 2.2, 2.4, 2.6, 2.85, 3.6, 4.1, 4.6, 4.9],
        College: [2.1, 2.1, 2.2, 2.3, 2.4, 2.4, 2.5, 2.7, 2.9, 3.2, 3.9, 4.5, 5, 5.3],
        Bachelor: [2.5, 2.4, 2.6, 2.7, 2.7, 2.7, 2.9, 3, 3.2, 3.5, 4.2, 4.8, 5.3, 5.6],
        Masters: [3.1, 3, 3.2, 3.3, 3.3, 3.3, 3.5, 3.7, 3.9, 4.1, 4.9, 5.4, 5.9, 6.2],
        Phd: [3.4, 3.4, 3.5, 3.6, 3.7, 3.7, 3.8, 4, 4.2, 4.4, 5.2, 5.7, 6.3, 6.6]
    };
    const pricingData1 = {
        HighSchool: [2, 2, 2.1, 2.2, 2.3, 2.3, 2.4, 2.6, 2.9, 3.1, 4, 4.5, 5.1, 5.4],
        College: [2.3, 2.3, 2.4, 2.5, 2.6, 2.6, 2.7, 3, 3.2, 3.5, 4.3, 5, 5.5, 5.8],
        Bachelor: [2.7, 2.6, 2.9, 3, 3, 3, 3.2, 3.3, 3.5, 3.9, 4.6, 5.3, 5.8, 6.2],
        Masters: [3.4, 3.3, 3.5, 3.6, 3.6, 3.6, 3.9, 4.1, 4.3, 4.5, 5.4, 6, 6.5, 6.8],
        Phd: [3.7, 3.7, 3.9, 4, 4.1, 4.1, 4.2, 4.4, 4.6, 4.8, 5.7, 6.3, 6.9, 7.3]
    };
      
      const deadlineOptions = [
        "2 month", "30 days", "20 Days", "14 Days", "10 Days", "7 Days",
        "5 days", "4 days", "3 days", "48 hours", "24 hours", "12 hours",
        "6 hours", "3 hours",
      ];
      
      const paperTypes = {
        "Admission/Application Essay": 1,
        "Annotated Bibliography": 0.7,
        "Argumentative Essay": 1,
        Article: 1.2,
        "Article Review/Critique": 1,
        Assessment: 1.2,
        Assignment: 1,
        "Book report/review": 1,
        "Business Plan": 1,
        Calculations: 1.2,
        "Capstone Project": { multiplier: 1, minDeadline: "24 hours", maxDeadline: "2 months" },
        "Case Study": 1.2,
        Coursework: 1.1,
        "Cover Letter Writing": { multiplier: 1, minDeadline: "48 hours" },
        "Discussion Post": 1,
        Dissertation: { multiplier: 1, minDeadline: "48 hours", maxDeadline: "2 months" },
        Editing: 0.5,
        Essay: 1,
        Formatting: 0.5,
        "Lab Report": 1.2,
        "Movie Review": 0.9,
        "Multiple Choice Questions": { multiplier: 0.1, noLevels: true },
        Other: 1.3,
        Outline: 1,
        Paraphrasing: 0.5,
        "Personal Statement": { multiplier: 2, minDeadline: "24 hours", maxDeadline: "7 days" },
        "Powerpoint presentation plain": 1,
        "Powerpoint presentation with Speaker's notes": 1.2,
        Proofreading: 0.5,
        "Reaction Paper": { multiplier: 1, maxDeadline: "2 months" },
        Report: 1.2,
        "Research Paper": { multiplier: 1.2, maxDeadline: "2 months" },
        "Research Proposal": { multiplier: 1.2, minDeadline: "24 hours", maxDeadline: "2 months" },
        "Resume Editing": { multiplier: 2, minDeadline: "48 hours" },
        "Resume Writing": { multiplier: 2.5, minDeadline: "48 hours" },
        "Retyping (pdf/png/handwriting to word)": 0.1,
        Rewriting: 0.5,
        "Scholarship Essay": { multiplier: 2, minDeadline: "24 hours" },
        Speech: 1,
        "Statistics Project": 1,
        Summary: 1,
        "Term Paper": { multiplier: 1, maxDeadline: "2 months" },
        Thesis: { multiplier: 0.9, minDeadline: "48 hours", maxDeadline: "2 months" },
        "Thesis Proposal": { multiplier: 1, minDeadline: "48 hours", maxDeadline: "2 months" },
        "Topic Suggestion": 0.2,
        "Topic Suggestion + Summary + References": 0.9,
      };
      
      function getClosestDeadlineForWriter(deadline) {
        const now = new Date();
        deadline = new Date(deadline);
      
        const diffInMs = deadline - now;
      
        // Convert the difference into hours
        const diffInHours = diffInMs / (1000 * 60 * 60);
        console.log("Diff In Hours",diffInHours)
      
        // Define specific rules for mapping deadlines
        if(diffInHours>=60*24){
          return "2 month"
        }
       else if (diffInHours >= 30 * 24) {
          return "30 days";
        } else if (diffInHours >= 20 * 24) {
          return "20 Days";
        } else if (diffInHours >= 14 * 24) {
          return "14 Days";
        } else if (diffInHours >= 10 * 24) {
          return "10 Days";
        } else if (diffInHours >= 7 * 24) {
          return "7 Days";
        } else if (diffInHours >= 5 * 24) {
          return "5 days";
        } else if (diffInHours >= 4 * 24) {
          return "4 days";
        } else if (diffInHours >= 3 * 24) {
          return "3 days";
        } else if (diffInHours >= 48) {
          return "48 hours";
        } else if (diffInHours >= 24) {
          return "24 hours";
        } else if (diffInHours >= 12) {
          return "12 hours";
        } else if (diffInHours >= 6) {
          return "6 hours";
        } else {
          return "3 hours";
        }
      }
      
      function getOptionValue(option) {
        let optionValue;
      
        // Handling months
        if (option.includes("month")) {
          optionValue = 2 * 30 * 24; // 2 months = 60 days = 60 * 24 hours
        }
        // Handling days (including plural and singular)
        else if (option.toLowerCase().includes("day")) {
          const days = parseInt(option);
          optionValue = days * 24; // Convert days to hours
        }
        // Handling hours
        else if (option.includes("hour")) {
          optionValue = parseInt(option); // Just use the number of hours
        }
      
        return optionValue;
      }
      
      const adjustPriceByTypeForWriter = (basePrice, paperType, deadline) => {
        try {
          const typeDetails = paperTypes[paperType];
      
          if (!typeDetails) return basePrice; // If type not found, return base price
      
          // Handle multiplier only
          if (typeof typeDetails === "number") {
            return basePrice * typeDetails;
          }
      
          // Handle complex rules with multiplier and deadlines
          let adjustedPrice = basePrice * (typeDetails.multiplier || 1);
      
          // Check minimum deadline constraints
          if (typeDetails.minDeadline) {
            const minDeadlineValue = getOptionValue(typeDetails.minDeadline);
            const selectedDeadlineValue = getOptionValue(deadline);
      
            // If the selected deadline is less than the min deadline, throw an error
            if (selectedDeadlineValue < minDeadlineValue) {
              throw new Error(`Minimum deadline for ${paperType} is ${typeDetails.minDeadline}`);
            }
          }
      
          // Check maximum deadline constraints
          if (typeDetails.maxDeadline) {
            const maxDeadlineValue = getOptionValue(typeDetails.maxDeadline);
            const selectedDeadlineValue = getOptionValue(deadline);
      
            if (selectedDeadlineValue > maxDeadlineValue) {
              throw new Error(`Maximum deadline for ${paperType} is ${typeDetails.maxDeadline}`);
            }
          }
      
          return adjustedPrice;
        } catch (e) {
          console.error(e.message);
          return basePrice; // Return base price in case of error
        }
      };
      
      const getPriceForWriter = (academicLevel, deadline) => {
        const deadlineIndex = deadlineOptions.indexOf(deadline);
      
        // If deadline or academic level is invalid, return an error
        if (deadlineIndex === -1 || !pricingData[academicLevel]) {
          return "Invalid input";
        }
      
        // Get the price from the array at the corresponding index
        if(fieldsOfStudy1.includes(fieldOfStudy)){
            return pricingData[academicLevel][deadlineIndex];
        }
        else {
        return pricingData1[academicLevel][deadlineIndex];

        }
      };
  return (
    <WriterPriceCalculationContext.Provider value={{getPriceForWriter,adjustPriceByTypeForWriter,getClosestDeadlineForWriter}}>
      {children} 
    </WriterPriceCalculationContext.Provider>
  );
};
