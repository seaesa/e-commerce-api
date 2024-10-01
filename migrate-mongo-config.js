import 'dotenv/config';

const config = {
    mongodb: { 
        url: process.env.MONGO_URL, 
        databaseName: 'fashion' || process.env.MONGO_DBNAME,
    },
    migrationsDir: 'database/migrations', 
    changelogCollectionName: 'migrations', 
    migrationFileExtension: '.js', 
    useFileHash: false, 
    moduleSystem: 'esm'  
};

export default config;
