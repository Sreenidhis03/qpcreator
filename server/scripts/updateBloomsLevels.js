// server/scripts/updateBloomsLevels.js

import mongoose from 'mongoose';
import Question from '../src/models/questionsModel.js'; // <-- Added 'src/' to the path
// Ensure this mapping is identical to your academicData.js in the client
const bloomsLevelMapping = {
  'Remembering (L1)': 'R',
  'Understanding (L2)': 'U',
  'Applying (L3)': 'A',
  'Analyzing (L4)': 'An',
  'Evaluating (L5)': 'E',
  'Creating (L6)': 'C'
};

const mongoURI = 'mongodb+srv://sreenidhi:sreenidhi03@cluster0.p60aynr.mongodb.net/QPaperDB';

mongoose.connect(mongoURI)
  .then(async () => {
    console.log('Connected to MongoDB for update script.');

    for (const longName in bloomsLevelMapping) {
      const shortCode = bloomsLevelMapping[longName];
      console.log(`Updating questions from '${longName}' to '${shortCode}'`);
      const result = await Question.updateMany(
        { bloomsLevel: longName },
        { $set: { bloomsLevel: shortCode } }
      );
      console.log(`Matched ${result.matchedCount} questions, modified ${result.modifiedCount} questions for ${longName}.`);
    }

    console.log('Bloom\'s levels update complete.');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Database connection error during update:', err);
    process.exit(1);
  });