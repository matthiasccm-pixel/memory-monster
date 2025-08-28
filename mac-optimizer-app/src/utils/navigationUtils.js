// Navigation and modal handling utility functions
import { openUpgradePage } from './upgradeUtils.js';

// Handle begin from access granted screen - MANUAL TRIGGER ONLY
export const handleBeginFromAccess = (setCurrentView) => {
  setCurrentView('dashboard');
};

// Handle activate plan actions with proper state cleanup
export const handleActivateNow = (setShowWelcomeModal, setShowActivationModal, setCurrentView, openExternalLink) => {
  // Clean close modal without triggering anything else
  setShowWelcomeModal(false);
  setShowActivationModal(false);
  
  // Open external link after modal closes
  setTimeout(() => {
    openUpgradePage();
    // Navigate to scanning ONLY after external link
    setTimeout(() => {
      setCurrentView('scanning');
    }, 500);
  }, 100);
};

export const handleBuyPlan = (setShowWelcomeModal, setShowActivationModal, setCurrentView, openExternalLink) => {
  // Clean close modal without triggering anything else
  setShowWelcomeModal(false);
  setShowActivationModal(false);
  
  // Open external link after modal closes
  setTimeout(() => {
    openUpgradePage();
    // Navigate to scanning ONLY after external link
    setTimeout(() => {
      setCurrentView('scanning');
    }, 500);
  }, 100);
};

export const handleSkipActivation = (setShowWelcomeModal, setShowActivationModal, setCurrentView) => {
  // Clean close modal without triggering anything else
  setShowWelcomeModal(false);
  setShowActivationModal(false);
  
  // Navigate directly to scanning
  setTimeout(() => {
    setCurrentView('scanning');
  }, 200);
};

// Handle main scan functionality
export const handleScan = (
  setCurrentView, 
  setShowWelcomeModal, 
  setShowActivationModal, 
  setIsScanning, 
  setScanComplete, 
  setAtlasMessages
) => {
  setCurrentView('scanning'); // Change to scanning view
  // Clean up any lingering modal states
  setShowWelcomeModal(false);
  setShowActivationModal(false);
  setIsScanning(true);
  setScanComplete(false);
  setAtlasMessages(prev => [...prev, "Memory liberation systems activated! Scanning for trapped memory... 🔍"]);
  
  setTimeout(() => {
    setIsScanning(false);
    setScanComplete(true);
    setAtlasMessages(prev => [...prev, "Liberation complete! ⚔️ I've located several memory monsters holding 21.4GB of your Mac's memory hostage. Based on intel from millions of fellow liberators, freeing this memory typically results in 23% faster performance and 31% better efficiency. Ready to start the rescue mission? 🚀"]);
  }, 4000);
};

// Handle chat message sending
export const handleSendMessage = (userInput, setAtlasMessages, setUserInput) => {
  if (userInput.trim()) {
    setAtlasMessages(prev => [...prev, `You: ${userInput}`]);
    
    setTimeout(() => {
      const responses = [
        "Great question! Based on data from 50,000+ successful liberations, I'd recommend freeing storage monsters first for maximum impact. 💚",
        "Smart thinking! Users who liberate memory regularly (every 2-3 weeks) maintain 34% better system performance over time. 🛡️",
        "Excellent observation! WhatsApp cache monsters are usually the easiest to free - users report immediate satisfaction after liberation. ⚡",
        "Perfect timing for that question! I've learned from thousands of successful rescues that steady, systematic memory liberation delivers the best results. ✨",
        "That's exactly the strategic approach that leads to victory! The liberation community discusses this tactic frequently. 💫"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setAtlasMessages(prev => [...prev, randomResponse]);
    }, 1200);
    
    setUserInput('');
  }
};

// Handle key press for chat
export const handleKeyPress = (e, handleSendMessage) => {
  if (e.key === 'Enter') {
    handleSendMessage();
  }
};
// Handle fixing individual issues
export const handleFix = async (
  issueId, 
  issues, 
  setFixingStates, 
  setIssues, 
  totalMemoryFreed, 
  setTotalMemoryFreed, 
  setRemainingMemory, 
  animateMemoryCounter, 
  hasCompletedFirstFix, 
  setHasCompletedFirstFix, 
  setMinimizedIssues, 
  setShowConfetti, 
  setAtlasMessages
) => {
  const issue = issues.find(i => i.id === issueId);
  setFixingStates(prev => ({ ...prev, [issueId]: 'analyzing' }));
  
  setTimeout(() => {
    setFixingStates(prev => ({ ...prev, [issueId]: 'liberating' }));
  }, 1200);
  
  setTimeout(() => {
    setFixingStates(prev => ({ ...prev, [issueId]: 'complete' }));
    setIssues(prev => prev.map(i =>
      i.id === issueId ? { ...i, fixed: true } : i
    ));
    
    const memoryAmount = issue.storage;
    const newTotalFreed = totalMemoryFreed + memoryAmount;
    const totalIssuesMemory = issues.reduce((sum, issue) => sum + issue.storage, 0);
    const newRemainingMemory = totalIssuesMemory - newTotalFreed;
    setTotalMemoryFreed(newTotalFreed);
    setRemainingMemory(newRemainingMemory);
    animateMemoryCounter(animateMemoryCounter, Math.max(0, newRemainingMemory), setRemainingMemory);
    
    // Mark that user has completed their first fix
    if (!hasCompletedFirstFix) {
      setHasCompletedFirstFix(true);
    }
    
    // Minimize immediately after completion
    setMinimizedIssues(prev => ({ ...prev, [issueId]: true }));
    
    const allFixed = issues.filter(i => i.id !== issueId).every(i => i.fixed);
    if (allFixed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      setAtlasMessages(prev => [...prev, "🎉 INCREDIBLE! You've liberated ALL trapped memory! Your Mac is now running at peak performance. The Memory Monster community salutes your victory! 🏆✨"]);
    }
    
    const celebrationMessage = `🏆 Victory! The ${issue.app} monster has been defeated! You just freed ${issue.storage}${issue.storageUnit} of memory and your Mac's performance is restored. ${issue.userCount} users freed ${issue.totalFreed} from ${issue.app} today! ✨`;
    setAtlasMessages(prev => [...prev, celebrationMessage]);
  }, 3800);
};

// Handle unlocking all issues at once
export const handleUnlockAll = async (issues, handleFix) => {
  const unlockedIssues = issues.filter(issue => !issue.fixed);
  for (let i = 0; i < unlockedIssues.length; i++) {
    const issue = unlockedIssues[i];
    setTimeout(() => {
      handleFix(issue.id);
    }, i * 500);
  }
};