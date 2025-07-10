import React from 'react';
import { ConnectHeader } from './ConnectHeader';
import { TabNavigation } from './TabNavigation';
import { ChatSidebar } from './ChatSidebar';
import { ChatArea } from './ChatArea';
import { MeetingsSidebar } from './MeetingsSidebar';
import { MeetingsArea } from './MeetingsArea';
import { CallsSidebar } from './CallsSidebar';
import { CallsArea } from './CallsArea';
import { NewChatModal } from './NewChatModal';
import { MeetingSchedulerModal } from './MeetingSchedulerModal';
import { Modal } from '@/components/ui/modal';
import { Calendar as DayPickerCalendar } from '@/components/ui/calendar';
import { Chat, Meeting, NewMeetingForm, TabType, FilterType, MessageFilter } from '../types';
import { useConnect } from '../hooks/useConnect';

export const ConnectView: React.FC = () => {
  const {
    // State
    activeTab,
    selectedChat,
    messages,
    newMessage,
    searchQuery,
    meetings,
    showScheduler,
    showNewChatModal,
    newChatForm,
    newMeetingForm,
    selectedFiles,
    callLogs,
    filterType,
    isArchived,
    showChatSettings,
    starredMessages,
    pinnedMessages,
    messageFilter,
    showCalendarModal,
    showFilterModal,
    editMeeting,
    editMeetingForm,
    editMeetingId,
    selectedCalendarDate,
    selectedDate,
    currentDate,
    filteredMessages,

    // Setters
    setActiveTab,
    setSelectedChat,
    setNewMessage,
    setSearchQuery,
    setShowScheduler,
    setShowNewChatModal,
    setNewChatForm,
    setNewMeetingForm,
    setSelectedFiles,
    setFilterType,
    setIsArchived,
    setShowChatSettings,
    setMessageFilter,
    setShowCalendarModal,
    setShowFilterModal,
    setEditMeeting,
    setEditMeetingForm,
    setEditMeetingId,
    setSelectedCalendarDate,
    setSelectedDate,
    setCurrentDate,
    setStarredMessages,
    setPinnedMessages,

    // Actions
    handleFileSelect,
    sendMessage,
    createNewChat,
    scheduleMeeting,
    archiveChat,
    deleteChat,
    startCall,
    markAsRead,
    toggleStarMessage,
    togglePinMessage,
    clearChat,
    navigateMonth,
    navigateYear,
    handleDateClick,
    updateMeeting
  } = useConnect();

  // Listen for the custom event to open the scheduler
  React.useEffect(() => {
    const handler = () => setShowScheduler(true);
    window.addEventListener('openMeetingScheduler', handler);
    return () => window.removeEventListener('openMeetingScheduler', handler);
  }, [setShowScheduler]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-y-auto">
      {/* Header */}
      <ConnectHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        isArchived={isArchived}
        setIsArchived={setIsArchived}
        setShowNewChatModal={setShowNewChatModal}
        setShowFilterModal={setShowFilterModal}
        messages={messages}
      />

      {/* Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        messages={messages}
      />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)] overflow-y-auto">
        {/* Sidebar */}
        {activeTab === 'messages' && (
          <ChatSidebar
            filteredMessages={filteredMessages}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            markAsRead={markAsRead}
            archiveChat={archiveChat}
            deleteChat={deleteChat}
          />
        )}

        {activeTab === 'meetings' && (
          <MeetingsSidebar meetings={meetings} />
        )}

        {activeTab === 'calls' && (
          <CallsSidebar callLogs={callLogs} />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'messages' && (
            <ChatArea
              selectedChat={selectedChat}
              messageFilter={messageFilter}
              setMessageFilter={setMessageFilter}
              starredMessages={starredMessages}
              pinnedMessages={pinnedMessages}
              toggleStarMessage={toggleStarMessage}
              togglePinMessage={togglePinMessage}
              startCall={startCall}
              setShowChatSettings={setShowChatSettings}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              selectedFiles={selectedFiles}
              handleFileSelect={handleFileSelect}
              sendMessage={sendMessage}
            />
          )}

          {activeTab === 'meetings' && (
            <MeetingsArea
              meetings={meetings}
              currentDate={currentDate}
              selectedDate={selectedDate}
              navigateMonth={navigateMonth}
              navigateYear={navigateYear}
              handleDateClick={handleDateClick}
              setEditMeeting={setEditMeeting}
              setEditMeetingId={setEditMeetingId}
              setEditMeetingForm={setEditMeetingForm}
            />
          )}

          {activeTab === 'calls' && <CallsArea />}
        </div>
      </div>

      {/* Modals */}
      <NewChatModal
        showNewChatModal={showNewChatModal}
        setShowNewChatModal={setShowNewChatModal}
        newChatForm={newChatForm}
        setNewChatForm={setNewChatForm}
        createNewChat={createNewChat}
      />

      <MeetingSchedulerModal
        showScheduler={showScheduler}
        setShowScheduler={setShowScheduler}
        newMeetingForm={newMeetingForm}
        setNewMeetingForm={setNewMeetingForm}
        scheduleMeeting={scheduleMeeting}
      />

      {/* Chat Settings Modal */}
      {showChatSettings && selectedChat && (
        <Modal
          title="Chat Settings"
          description={`Settings for ${selectedChat.projectName}`}
          isOpen={showChatSettings}
          onClose={() => setShowChatSettings(false)}
        >
          <div className="space-y-4">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              onClick={() => {
                setPinnedMessages(prev => ({ ...prev, [selectedChat.id]: [] }));
                setStarredMessages(prev => ({ ...prev, [selectedChat.id]: [] }));
                clearChat(selectedChat.id);
                setShowChatSettings(false);
              }}
            >
              Clear Chat
            </button>
            <button
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              onClick={() => {
                deleteChat(selectedChat.id);
                setShowChatSettings(false);
              }}
            >
              Delete Chat
            </button>
            <div className="pt-2">
              <div className="font-semibold mb-2">Starred Messages</div>
              <ul className="max-h-32 overflow-y-auto text-sm">
                {(selectedChat.messages.filter(m => (starredMessages[selectedChat.id]||[]).includes(m.id))).map(m => (
                  <li key={m.id} className="mb-1">{m.content}</li>
                ))}
                {!(starredMessages[selectedChat.id]||[]).length && <li className="text-muted-foreground">No starred messages</li>}
              </ul>
            </div>
            <div className="pt-2">
              <div className="font-semibold mb-2">Pinned Messages</div>
              <ul className="max-h-32 overflow-y-auto text-sm">
                {(selectedChat.messages.filter(m => (pinnedMessages[selectedChat.id]||[]).includes(m.id))).map(m => (
                  <li key={m.id} className="mb-1">{m.content}</li>
                ))}
                {!(pinnedMessages[selectedChat.id]||[]).length && <li className="text-muted-foreground">No pinned messages</li>}
              </ul>
            </div>
          </div>
        </Modal>
      )}

      {/* Calendar Modal */}
      {showCalendarModal && (
        <Modal title="Pick a Date" description="Jump to a date" isOpen={showCalendarModal} onClose={() => setShowCalendarModal(false)}>
          <DayPickerCalendar mode="single" selected={selectedCalendarDate} onSelect={setSelectedCalendarDate} />
        </Modal>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <Modal title="Filter Chats" description="Filter by type or participant" isOpen={showFilterModal} onClose={() => setShowFilterModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Chat Type</label>
              <select value={filterType} onChange={e => setFilterType(e.target.value as FilterType)} className="w-full bg-secondary text-foreground px-4 py-2 rounded-lg">
                <option value="all">All</option>
                <option value="project">Project-Based</option>
                <option value="global">Global</option>
                <option value="admin">Admin Support</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Participant</label>
              <input type="text" placeholder="Search participant..." className="w-full bg-secondary text-foreground px-4 py-2 rounded-lg" onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </Modal>
      )}

      {/* Meeting Edit Modal */}
      {editMeeting && (
        <Modal title="Edit Meeting" description="Update meeting details" isOpen={!!editMeeting} onClose={() => setEditMeeting(null)}>
          <div className="space-y-4">
            <input type="text" className="w-full bg-secondary text-foreground px-4 py-2 rounded-lg" value={editMeetingForm.title} onChange={e => setEditMeetingForm(f => ({ ...f, title: e.target.value }))} placeholder="Meeting title" />
            <input type="date" className="w-full bg-secondary text-foreground px-4 py-2 rounded-lg" value={editMeetingForm.date} onChange={e => setEditMeetingForm(f => ({ ...f, date: e.target.value }))} />
            <input type="time" className="w-full bg-secondary text-foreground px-4 py-2 rounded-lg" value={editMeetingForm.time} onChange={e => setEditMeetingForm(f => ({ ...f, time: e.target.value }))} />
            <input type="text" className="w-full bg-secondary text-foreground px-4 py-2 rounded-lg" value={editMeetingForm.participants} onChange={e => setEditMeetingForm(f => ({ ...f, participants: e.target.value }))} placeholder="Participants (comma separated)" />
            <select className="w-full bg-secondary text-foreground px-4 py-2 rounded-lg" value={editMeetingForm.type} onChange={e => setEditMeetingForm(f => ({ ...f, type: e.target.value }))}>
              <option value="zoom">Zoom Meeting</option>
              <option value="teams">Teams Meeting</option>
              <option value="meet">Google Meet</option>
            </select>
            <div className="flex space-x-3">
              <button onClick={() => setEditMeeting(null)} className="flex-1 bg-muted hover:bg-secondary px-4 py-2 rounded-lg">Cancel</button>
              <button onClick={updateMeeting} className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white">Save</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}; 