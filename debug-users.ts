
import mongoose from 'mongoose';
import dbConnect from './lib/db';
import User from './models/User';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function debug() {
    await dbConnect();
    const emailToSearch = 'cutebuuny1437@gmail.com';
    const normalized = emailToSearch.toLowerCase();
    
    console.log('Searching for:', normalized);
    
    const user = await User.findOne({ email: normalized });
    if (user) {
        console.log('✅ User found:', user.email);
    } else {
        console.log('❌ User not found');
        
        // Let's see all users to check for typos
        const allUsers = await User.find({}, 'email name');
        console.log('All Users in DB:');
        allUsers.forEach(u => console.log(`- ${u.email} (${u.name})`));
    }
    
    process.exit(0);
}

debug().catch(err => {
    console.error(err);
    process.exit(1);
});
