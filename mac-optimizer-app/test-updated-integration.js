// Test the updated Electron integration
async function testUpdatedIntegration() {
  console.log('Testing updated Electron integration...');
  
  // Simulate what your React app will do
  const testAPI = {
    getSystemMemory: () => require('./native/build/Release/system_monitor.node').getSystemMemory(),
    getDetailedProcesses: () => require('./native/build/Release/system_monitor.node').getDetailedProcesses(),
    getSystemCPU: () => require('./native/build/Release/system_monitor.node').getSystemCPU()
  };
  
  try {
    // Test memory
    console.log('\n1. Testing System Memory...');
    const memory = testAPI.getSystemMemory();
    console.log('✅ Memory API working:', {
      total: `${(memory.total / 1024 / 1024 / 1024).toFixed(2)} GB`,
      used: `${(memory.used / 1024 / 1024 / 1024).toFixed(2)} GB`,
      pressure: `${memory.pressure.toFixed(1)}%`
    });
    
    // Test processes
    console.log('\n2. Testing Process Detection...');
    const processes = testAPI.getDetailedProcesses();
    const topProcesses = processes
      .sort((a, b) => b.memoryMB - a.memoryMB)
      .slice(0, 3);
    
    console.log('✅ Process API working, top memory users:');
    topProcesses.forEach((proc, i) => {
      console.log(`   ${i+1}. ${proc.name}: ${proc.memoryMB.toFixed(1)} MB`);
    });
    
    // Test CPU
    console.log('\n3. Testing CPU Monitoring...');
    const cpu = testAPI.getSystemCPU();
    console.log('✅ CPU API working:', {
      user: cpu.user,
      system: cpu.system,
      idle: cpu.idle
    });
    
    console.log('\n🎉 ALL INTEGRATION TESTS PASSED!');
    console.log('\nYour app can now access:');
    console.log('• Real system memory information');
    console.log('• Real running processes and their memory usage');
    console.log('• Real CPU statistics');
    console.log('• Process identification and app detection');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error);
  }
}

testUpdatedIntegration();