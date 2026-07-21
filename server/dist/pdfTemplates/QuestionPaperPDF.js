// server/pdfTemplates/QuestionPaperPDF.js
// This file defines how your question paper looks in PDF format using React components

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// --- Font Registration (Optional but recommended for consistency) ---
// If you want to use specific fonts that match your sample paper,
// you would register them here. For example:
// Font.register({ family: 'Times New Roman', src: 'path/to/TimesNewRoman.ttf' });
// For now, we'll stick to default fonts like Helvetica.
// -------------------------------------------------------------------

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
    // Default font, change if you register others
    fontSize: 10 // Base font size
  },
  headerSection: {
    marginBottom: 20,
    textAlign: 'center'
  },
  collegeName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4
  },
  examTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2
  },
  courseInfo: {
    fontSize: 10,
    marginBottom: 2
  },
  paperCode: {
    fontSize: 10,
    marginBottom: 10
  },
  timeAndWeight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    fontSize: 10
  },
  partHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5
  },
  moduleHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center'
  },
  instructions: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    alignItems: 'center',
    minHeight: 24
  },
  tableHeader: {
    backgroundColor: '#F0F0F0',
    fontWeight: 'bold'
  },
  tableCell: {
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#000',
    flexGrow: 1 // Allow cells to grow
  },
  qNoCell: {
    width: '10%',
    textAlign: 'center'
  },
  questionTextCell: {
    width: '60%'
  },
  // Adjust width as needed
  weightCell: {
    width: '10%',
    textAlign: 'center'
  },
  levelCell: {
    width: '10%',
    textAlign: 'center'
  },
  // For Blooms Level
  cosCell: {
    width: '10%',
    textAlign: 'center',
    borderRightWidth: 0
  },
  // No right border on last cell

  questionText: {
    fontSize: 10,
    lineHeight: 1.3
  },
  // Styling for 'OR' separator (if applicable)
  orSeparator: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5
  },
  footer: {
    fontSize: 8,
    textAlign: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    color: '#888888'
  }
});
const QuestionPaperPDF = ({
  data
}) => {
  // Prepare questions for display, grouping them by module/part if necessary
  // In a real system, your 'data.parts' array from QuestionPaper model would be used.

  return /*#__PURE__*/React.createElement(Document, null, /*#__PURE__*/React.createElement(Page, {
    size: "A4",
    style: styles.page
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.headerSection
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.collegeName
  }, data.collegeName), /*#__PURE__*/React.createElement(Text, {
    style: styles.examTitle
  }, data.examTitle, " ", data.examMonthYear), /*#__PURE__*/React.createElement(Text, {
    style: styles.courseInfo
  }, data.courseDetails), /*#__PURE__*/React.createElement(Text, {
    style: styles.paperCode
  }, data.paperCode, " - ", data.paperName)), /*#__PURE__*/React.createElement(View, {
    style: styles.timeAndWeight
  }, /*#__PURE__*/React.createElement(Text, null, "Time: ", data.time), /*#__PURE__*/React.createElement(Text, null, "Max. Weight: ", data.maxWeight)), data.parts && data.parts.map(part => /*#__PURE__*/React.createElement(View, {
    key: part.partName
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.partHeader
  }, part.partName, ": ", part.moduleName), /*#__PURE__*/React.createElement(Text, {
    style: styles.moduleHeader
  }, part.co), /*#__PURE__*/React.createElement(Text, {
    style: styles.instructions
  }, "(Maximum Weight from ", part.partName, ": ", part.maxWeightPart, " Weight)"), /*#__PURE__*/React.createElement(Text, {
    style: styles.instructions
  }, part.instructions), /*#__PURE__*/React.createElement(View, {
    style: [styles.tableRow, styles.tableHeader]
  }, /*#__PURE__*/React.createElement(Text, {
    style: [styles.tableCell, styles.qNoCell]
  }, "Q. No."), /*#__PURE__*/React.createElement(Text, {
    style: [styles.tableCell, styles.questionTextCell]
  }, "Question"), /*#__PURE__*/React.createElement(Text, {
    style: [styles.tableCell, styles.weightCell]
  }, "Weight"), /*#__PURE__*/React.createElement(Text, {
    style: [styles.tableCell, styles.levelCell]
  }, "Level"), " ", /*#__PURE__*/React.createElement(Text, {
    style: [styles.tableCell, styles.cosCell]
  }, "COs")), part.questionReferences && part.questionReferences.map((item, index) => /*#__PURE__*/React.createElement(View, {
    key: item.question,
    style: styles.tableRow,
    break: index > 0 && index % 4 === 0
  }, /*#__PURE__*/React.createElement(Text, {
    style: [styles.tableCell, styles.qNoCell]
  }, index + 1), /*#__PURE__*/React.createElement(Text, {
    style: [styles.tableCell, styles.questionTextCell]
  }, item.question.text), /*#__PURE__*/React.createElement(Text, {
    style: [styles.tableCell, styles.weightCell]
  }, item.marksAllocated), " ", /*#__PURE__*/React.createElement(Text, {
    style: [styles.tableCell, styles.levelCell]
  }, item.question.bloomsLevel || 'N/A'), /*#__PURE__*/React.createElement(Text, {
    style: [styles.tableCell, styles.cosCell]
  }, item.question.cos || 'N/A'))))), /*#__PURE__*/React.createElement(Text, {
    style: styles.footer
  }, "Page ", /*#__PURE__*/React.createElement(Text, {
    render: ({
      pageNumber,
      totalPages
    }) => `${pageNumber} of ${totalPages}`
  }))));
};
export default QuestionPaperPDF;