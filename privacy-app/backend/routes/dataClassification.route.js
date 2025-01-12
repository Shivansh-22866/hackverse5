import { Router } from "express";
import multer from "multer";
import xlsx from "xlsx";
import csvParser from "csv-parser";
import fs from "fs";
import authMiddleware from "../middlewares/auth.middleware.js";
import path from "path";

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

// Define patterns for sensitive data
const patterns = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  creditCard: /\b(?:\d[ -]*?){13,16}\b/g,
  ipAddress: /(?:\d{1,3}\.){3}\d{1,3}/g,
  dateOfBirth: /\b\d{1,2}[-/]\d{1,2}[-/]\d{4}\b/g,
  passport: /\b([A-Z]{2}[0-9]{7})\b/g,  // Passport number format example
};

// Utility function to classify sensitive data from text
const classifyTextData = (data) => {
  const results = {};
  for (const [type, pattern] of Object.entries(patterns)) {
    results[type] = (data.match(pattern) || []).length;
  }
  return results;
};

// Helper to parse CSV content
const parseCsvFile = (fileContent) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fileContent
      .pipe(csvParser())
      .on('data', (row) => results.push(row))
      .on('end', () => resolve(results.join(' ')))
      .on('error', (error) => reject(error));
  });
};

// Helper to parse Excel content
const parseXlsxFile = (fileContent) => {
  const workbook = xlsx.read(fileContent, { type: 'buffer' });
  let textContent = '';
  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    textContent += xlsx.utils.sheet_to_csv(sheet);
  });
  return textContent;
};

// File classification route
router.post('/classify', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    
    if (!file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    let fileContent = '';
    const fileExtension = path.extname(file.originalname).toLowerCase();

    // Process based on file type
    if (fileExtension === '.txt') {
      fileContent = file.buffer.toString();
    } else if (fileExtension === '.csv') {
      fileContent = await parseCsvFile(file.buffer);
    } else if (fileExtension === '.xlsx') {
      fileContent = await parseXlsxFile(file.buffer);
    } else if (fileExtension === '.json') {
      fileContent = JSON.stringify(JSON.parse(file.buffer.toString()));
    } else {
      return res.status(400).json({ msg: 'Unsupported file type' });
    }

    // Classify sensitive data from the extracted text content
    const results = classifyTextData(fileContent);
    res.json({ results });

  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

export default router;
