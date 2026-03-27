
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function debug() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        console.error('MONGODB_URI is not defined');
        process.exit(1);
    }
    
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected');
    
    // Using a dynamic schema to avoid importing model
    const User = mongoose.model('User', new mongoose.Schema({ email: String, name: String }));
    
    const emailToSearch = 'cutebuuny1437@gmail.com';
    const normalized = emailToSearch.toLowerCase();
    
    console.log('Searching for:', normalized);
    
    const user = await User.findOne({ email: normalized });
    if (user) {
        console.log('✅ User found:', JSON.stringify(user, null, 2));
    } else {
        console.log('❌ User not found');
        
        // Let's see all users to check for typos
        const allUsers = await User.find({}, 'email name');
        console.log('All Users in DB:');
        allUsers.forEach(u => console.log(`- ${u.email} (${u.name})`));
    }
    
    await mongoose.connection.close();
    process.exit(0);
}

debug().catch(err => {
    console.error(err);
    process.exit(1);
});
