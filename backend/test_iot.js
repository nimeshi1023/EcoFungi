// Test script to verify IoT data storage
const axios = require('axios');

const testIoTData = async () => {
  try {
    console.log('Testing IoT data storage...');
    
    // Test storing IoT data
    const testData = {
      temperature: 25.5,
      humidity: 65.2
    };
    
    const storeResponse = await axios.post('http://localhost:5000/iot/store', testData);
    console.log('✅ Data stored successfully:', storeResponse.data);
    
    // Test retrieving latest data
    const latestResponse = await axios.get('http://localhost:5000/iot/latest');
    console.log('✅ Latest data retrieved:', latestResponse.data);
    
    // Test retrieving stats
    const statsResponse = await axios.get('http://localhost:5000/iot/stats');
    console.log('✅ Stats retrieved:', statsResponse.data);
    
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

// Run test if this file is executed directly
if (require.main === module) {
  testIoTData();
}

module.exports = testIoTData;
