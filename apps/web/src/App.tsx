import React, { useEffect } from 'react';
import { useGameStore } from './store/gameStore.js';
import { socket } from './services/socket.js';
import { Header } from './components/common/Header.js';
import { Toast } from './components/common/Toast.js';
import { HomeScreen } from './components/home/HomeScreen.js';
import { CreateGameModal } from './components/home/CreateGameModal.js';
import { JoinGameModal } from './components/home/JoinGameModal.js';
import { HowToPlayModal } from './components/home/HowToPlayModal.js';
import { LobbyScreen } from './components/lobby/LobbyScreen.js';
import { GameScreen } from './components/game/GameScreen.js';
import { MatchSettingsModal } from './components/settings/MatchSettingsModal.js';

export const App: React.FC = () => {
  const {
    roomState,
    activeModal,
    setConnected,
    setRoomState,
    addChatMessage,
    showToast,
    clearSession,
    initSession,
  } = useGameStore();

  useEffect(() => {
    // 1. Connection state listeners
    const handleConnect = () => {
      setConnected(true);
      // Attempt to restore stored session
      initSession();
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    if (socket.connected) {
      setConnected(true);
      initSession();
    }

    // 2. Room State listener
    socket.on('room:state', (state) => {
      setRoomState(state);
    });

    // 3. Chat listener
    socket.on('chat:message', (message) => {
      addChatMessage(message);
    });

    // 4. Player kicked listener
    socket.on('player:kicked', (data) => {
      clearSession();
      showToast(data.reason || 'You were kicked from the room.', 'error');
    });

    // 5. Game starting countdown listener
    socket.on('game:starting', (data) => {
      showToast(`Match starting in ${data.countdown} seconds! Prepare for Phase 2!`, 'success');
    });

    // 6. Generic error notifications
    socket.on('error:notification', (data) => {
      showToast(data.message, 'error');
    });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('room:state');
      socket.off('chat:message');
      socket.off('player:kicked');
      socket.off('game:starting');
      socket.off('error:notification');
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-text flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      <Header />

      <main className="flex-1 flex flex-col">
        {!roomState ? (
          <HomeScreen />
        ) : roomState.status === 'IN_GAME' ? (
          <GameScreen />
        ) : (
          <LobbyScreen />
        )}
      </main>

      {/* Modals */}
      {activeModal === 'CREATE' && <CreateGameModal />}
      {activeModal === 'JOIN' && <JoinGameModal />}
      {activeModal === 'HOW_TO_PLAY' && <HowToPlayModal />}
      {activeModal === 'SETTINGS' && <MatchSettingsModal />}

      {/* Toast notifications */}
      <Toast />
    </div>
  );
};

export default App;
