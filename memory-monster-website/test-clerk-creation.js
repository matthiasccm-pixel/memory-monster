// Quick test to verify Clerk account creation process
// Run with: node test-clerk-creation.js

const { Clerk } = require('@clerk/clerk-sdk-node');

// Initialize Clerk with your secret key
const clerk = Clerk({
  secretKey: 'sk_test_wg8xNbLSb3s33HfJngStDECmM8FhVKowDKOSGm0Fkb'
});

async function testAccountCreation() {
  try {
    console.log('Testing Clerk account creation...');
    
    // Check if user exists
    const existingUser = await clerk.users.getUserList({
      emailAddress: ['david@test.com']
    });
    
    if (existingUser.length > 0) {
      console.log('✅ User already exists:', existingUser[0].id);
      console.log('Email verified:', existingUser[0].emailAddresses[0].verification.status);
      return existingUser[0];
    }
    
    // If user doesn't exist, that's normal for fresh test
    console.log('ℹ️ User does not exist yet, which is expected');
    console.log('The account will be created when the user enters their password');
    
  } catch (error) {
    console.error('Error testing account:', error);
  }
}

testAccountCreation();