#include <napi.h>
#include <sys/sysctl.h>
#include <mach/mach.h>
#include <mach/vm_map.h>
#include <mach/mach_host.h>
#include <libproc.h>
#include <unistd.h>
#include <vector>
#include <string>

// Get system memory information
Napi::Object GetSystemMemory(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    vm_statistics64_data_t vm_stat;
    mach_msg_type_number_t count = HOST_VM_INFO64_COUNT;
    
    if (host_statistics64(mach_host_self(), HOST_VM_INFO64, 
                         (host_info64_t)&vm_stat, &count) != KERN_SUCCESS) {
        Napi::TypeError::New(env, "Failed to get memory statistics").ThrowAsJavaScriptException();
        return Napi::Object::New(env);
    }
    
    // Get page size
    vm_size_t page_size;
    size_t len = sizeof(page_size);
    sysctlbyname("hw.pagesize", &page_size, &len, NULL, 0);
    
    // Calculate memory values in bytes
    uint64_t free_memory = (uint64_t)vm_stat.free_count * page_size;
    uint64_t active_memory = (uint64_t)vm_stat.active_count * page_size;
    uint64_t inactive_memory = (uint64_t)vm_stat.inactive_count * page_size;
    uint64_t wired_memory = (uint64_t)vm_stat.wire_count * page_size;
    uint64_t compressed_memory = (uint64_t)vm_stat.compressor_page_count * page_size;
    
    // Get total physical memory
    uint64_t total_memory = 0;
    len = sizeof(total_memory);
    sysctlbyname("hw.memsize", &total_memory, &len, NULL, 0);
    
    uint64_t used_memory = active_memory + inactive_memory + wired_memory + compressed_memory;
    double memory_pressure = (double)used_memory / total_memory * 100.0;
    
    Napi::Object result = Napi::Object::New(env);
    result.Set("total", Napi::Number::New(env, total_memory));
    result.Set("free", Napi::Number::New(env, free_memory));
    result.Set("active", Napi::Number::New(env, active_memory));
    result.Set("inactive", Napi::Number::New(env, inactive_memory));
    result.Set("wired", Napi::Number::New(env, wired_memory));
    result.Set("compressed", Napi::Number::New(env, compressed_memory));
    result.Set("used", Napi::Number::New(env, used_memory));
    result.Set("pressure", Napi::Number::New(env, memory_pressure));
    
    return result;
}

// Get detailed process information
Napi::Array GetDetailedProcesses(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Napi::Array processes = Napi::Array::New(env);
    
    // Get list of all PIDs
    int numberOfProcesses = proc_listpids(PROC_ALL_PIDS, 0, NULL, 0);
    pid_t pids[numberOfProcesses];
    proc_listpids(PROC_ALL_PIDS, 0, pids, sizeof(pids));
    
    int processIndex = 0;
    
    for (int i = 0; i < numberOfProcesses; ++i) {
        if (pids[i] == 0) continue;
        
        // Get process info
        struct proc_taskallinfo taskInfo;
        int result = proc_pidinfo(pids[i], PROC_PIDTASKALLINFO, 0, &taskInfo, sizeof(taskInfo));
        
        if (result <= 0) continue;
        
        // Get process name
        char pathBuffer[PROC_PIDPATHINFO_MAXSIZE];
        int pathResult = proc_pidpath(pids[i], pathBuffer, sizeof(pathBuffer));
        
        std::string processName = "Unknown";
        if (pathResult > 0) {
            std::string fullPath(pathBuffer);
            size_t lastSlash = fullPath.find_last_of('/');
            if (lastSlash != std::string::npos) {
                processName = fullPath.substr(lastSlash + 1);
            }
        }
        
        // Skip system processes and very low memory processes
        uint64_t memoryBytes = taskInfo.ptinfo.pti_resident_size;
        if (memoryBytes < 1024 * 1024) continue; // Skip processes using less than 1MB
        
        Napi::Object process = Napi::Object::New(env);
        process.Set("pid", Napi::Number::New(env, pids[i]));
        process.Set("name", Napi::String::New(env, processName));
        process.Set("memoryBytes", Napi::Number::New(env, memoryBytes));
        process.Set("memoryMB", Napi::Number::New(env, memoryBytes / (1024.0 * 1024.0)));
        process.Set("cpuTime", Napi::Number::New(env, taskInfo.ptinfo.pti_total_user + taskInfo.ptinfo.pti_total_system));
        
        processes.Set(processIndex++, process);
    }
    
    return processes;
}

// Get system CPU information
Napi::Object GetSystemCPU(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    host_cpu_load_info_data_t cpuinfo;
    mach_msg_type_number_t count = HOST_CPU_LOAD_INFO_COUNT;
    
    if (host_statistics(mach_host_self(), HOST_CPU_LOAD_INFO, 
                       (host_info_t)&cpuinfo, &count) != KERN_SUCCESS) {
        Napi::TypeError::New(env, "Failed to get CPU statistics").ThrowAsJavaScriptException();
        return Napi::Object::New(env);
    }
    
    Napi::Object result = Napi::Object::New(env);
    result.Set("user", Napi::Number::New(env, cpuinfo.cpu_ticks[CPU_STATE_USER]));
    result.Set("system", Napi::Number::New(env, cpuinfo.cpu_ticks[CPU_STATE_SYSTEM]));
    result.Set("idle", Napi::Number::New(env, cpuinfo.cpu_ticks[CPU_STATE_IDLE]));
    result.Set("nice", Napi::Number::New(env, cpuinfo.cpu_ticks[CPU_STATE_NICE]));
    
    return result;
}

// Initialize the addon
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "getSystemMemory"),
                Napi::Function::New(env, GetSystemMemory));
    exports.Set(Napi::String::New(env, "getDetailedProcesses"),
                Napi::Function::New(env, GetDetailedProcesses));
    exports.Set(Napi::String::New(env, "getSystemCPU"),
                Napi::Function::New(env, GetSystemCPU));
    return exports;
}

NODE_API_MODULE(system_monitor, Init)