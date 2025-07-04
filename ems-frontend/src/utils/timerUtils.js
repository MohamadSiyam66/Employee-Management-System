// Utility functions for timer component

export const saveWorkLogToFile = async (logData) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        const fileName = `daily_work_log_${currentDate.replace(/-/g, '_')}.json`;
        
        // Get existing logs from localStorage
        const existingLogs = JSON.parse(localStorage.getItem(`work_logs_${currentDate}`) || '[]');
        existingLogs.push(logData);
        
        // Save to localStorage
        localStorage.setItem(`work_logs_${currentDate}`, JSON.stringify(existingLogs));
        
        // Create downloadable file
        const dataStr = JSON.stringify(existingLogs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // Create download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = fileName;
        link.click();
        
        // Also try to save to public folder using File System Access API (if supported)
        try {
            if ('showSaveFilePicker' in window) {
                const handle = await window.showSaveFilePicker({
                    suggestedName: fileName,
                    types: [{
                        description: 'JSON Files',
                        accept: { 'application/json': ['.json'] },
                    }],
                });
                const writable = await handle.createWritable();
                await writable.write(dataStr);
                await writable.close();
            }
        } catch (fsError) {
            console.log('File System Access API not supported or user cancelled, using download fallback');
        }
        
        return true;
    } catch (error) {
        console.error('Error saving work log to file:', error);
        return false;
    }
};

export const saveWorkLogToPublicFolder = async (logData) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        const fileName = `work_log_${logData.employeeId}_${currentDate}.json`;
        
        // Create the log entry with timestamp and session details
        const logEntry = {
            ...logData,
            timestamp: new Date().toISOString(),
            sessionId: `${logData.employeeId}_${Date.now()}`,
            browserInfo: {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language
            }
        };
        
        // Get existing logs for this employee and date
        const existingLogs = JSON.parse(localStorage.getItem(`work_logs_${logData.employeeId}_${currentDate}`) || '[]');
        existingLogs.push(logEntry);
        
        // Save to localStorage
        localStorage.setItem(`work_logs_${logData.employeeId}_${currentDate}`, JSON.stringify(existingLogs));
        
        // Create comprehensive file content with metadata
        const fileContent = {
            metadata: {
                generatedAt: new Date().toISOString(),
                employeeId: logData.employeeId,
                employeeName: logData.employeeName,
                date: currentDate,
                totalSessions: existingLogs.length,
                totalWorkTime: existingLogs.reduce((sum, log) => sum + (log.workDurationSeconds || 0), 0)
            },
            logs: existingLogs
        };
        
        const jsonContent = JSON.stringify(fileContent, null, 2);
        
        // Create downloadable file
        const dataBlob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = fileName;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Also save a daily summary file
        await saveDailySummary(logData.employeeId, currentDate, existingLogs);
        
        console.log(`Work log saved: ${fileName}`);
        return true;
        
    } catch (error) {
        console.error('Error saving work log to public folder:', error);
        return false;
    }
};

export const saveDailySummary = async (employeeId, date, logs) => {
    try {
        const summaryFileName = `daily_summary_${employeeId}_${date}.json`;
        
        const summary = {
            employeeId: employeeId,
            date: date,
            totalSessions: logs.length,
            totalWorkTime: logs.reduce((sum, log) => sum + (log.workDurationSeconds || 0), 0),
            totalWorkTimeFormatted: formatTime(logs.reduce((sum, log) => sum + (log.workDurationSeconds || 0), 0)),
            averageSessionTime: logs.length > 0 ? logs.reduce((sum, log) => sum + (log.workDurationSeconds || 0), 0) / logs.length : 0,
            sessions: logs.map(log => ({
                startTime: log.startTime,
                endTime: log.endTime,
                duration: log.workDuration,
                durationSeconds: log.workDurationSeconds,
                blockers: log.blockers,
                timestamp: log.timestamp
            }))
        };
        
        const summaryBlob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
        const summaryLink = document.createElement('a');
        summaryLink.href = URL.createObjectURL(summaryBlob);
        summaryLink.download = summaryFileName;
        
        document.body.appendChild(summaryLink);
        summaryLink.click();
        document.body.removeChild(summaryLink);
        
        console.log(`Daily summary saved: ${summaryFileName}`);
        return true;
        
    } catch (error) {
        console.error('Error saving daily summary:', error);
        return false;
    }
};

export const exportWorkLogsToCSV = (logs, date) => {
    try {
        const headers = ['Employee ID', 'Employee Name', 'Work Duration', 'Date', 'Blockers', 'Start Time', 'End Time', 'Timestamp'];
        const csvContent = [
            headers.join(','),
            ...logs.map(log => [
                log.employeeId,
                `"${log.employeeName}"`,
                log.workDuration,
                log.date,
                `"${log.blockers || ''}"`,
                log.startTime,
                log.endTime,
                log.timestamp || new Date().toISOString()
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `work_logs_${date.replace(/-/g, '_')}.csv`;
        link.click();
        
        return true;
    } catch (error) {
        console.error('Error exporting work logs to CSV:', error);
        return false;
    }
};

export const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatTimeForDisplay = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
};

export const getTimerStateFromStorage = (employeeId, date) => {
    try {
        const savedState = localStorage.getItem(`timer_${employeeId}_${date}`);
        return savedState ? JSON.parse(savedState) : null;
    } catch (error) {
        console.error('Error loading timer state:', error);
        return null;
    }
};

export const saveTimerStateToStorage = (employeeId, date, timerData) => {
    try {
        localStorage.setItem(`timer_${employeeId}_${date}`, JSON.stringify(timerData));
        return true;
    } catch (error) {
        console.error('Error saving timer state:', error);
        return false;
    }
};

export const clearTimerStateFromStorage = (employeeId, date) => {
    try {
        localStorage.removeItem(`timer_${employeeId}_${date}`);
        return true;
    } catch (error) {
        console.error('Error clearing timer state:', error);
        return false;
    }
}; 