const systemMonitor = require('./native/build/Release/system_monitor.node');

console.log('Testing native system monitor...');

try {
    const memory = systemMonitor.getSystemMemory();
    console.log('Memory Info:', {
        total: `${(memory.total / 1024 / 1024 / 1024).toFixed(2)} GB`,
        used: `${(memory.used / 1024 / 1024 / 1024).toFixed(2)} GB`,
        free: `${(memory.free / 1024 / 1024).toFixed(2)} MB`,
        pressure: `${memory.pressure.toFixed(1)}%`
    });

    const processes = systemMonitor.getDetailedProcesses();
    console.log(`Found ${processes.length} processes`);
    
    // Show top 5 memory users
    const sortedProcesses = processes
        .sort((a, b) => b.memoryMB - a.memoryMB)
        .slice(0, 5);
    
    console.log('Top 5 Memory Users:');
    sortedProcesses.forEach((proc, i) => {
        console.log(`${i+1}. ${proc.name}: ${proc.memoryMB.toFixed(1)} MB`);
    });

    const cpu = systemMonitor.getSystemCPU();
    console.log('CPU Info:', cpu);

} catch (error) {
    console.error('Error testing native module:', error);
}