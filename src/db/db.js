import mongoose from 'mongoose';  
// kết nối với mongôdb
export default async function DB (app) {
  const PORT = process.env.PORT || 5001;
  const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://admin:admin@dbcluslter.3pjttte.mongodb.net/fashion?retryWrites=true&w=majority';

  try {
      // kết nối database
      await mongoose.connect(MONGO_URL);

      // start server backend
      app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`); 
      });
  } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
  }
}
