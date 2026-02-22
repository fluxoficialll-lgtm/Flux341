
import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useGroups } from '../hooks/useGroups';
import { useModal } from '../Componentes/ModalSystem';
import { Group } from '../types';
import { Footer } from '../Componentes/layout/Footer';
import { MainHeader } from '../Componentes/layout/MainHeader';
import { JoinViaLinkBtn } from '../Componentes/groups/list/JoinViaLinkBtn';
import { GroupListItem } from '../Componentes/groups/list/GroupListItem';
import { CreateGroupFAB } from '../Componentes/groups/list/CreateGroupFAB';

const TrackingModal = lazy(() => import('../Componentes/groups/TrackingModal').then(m => ({ default: m.TrackingModal })));

export const Groups: React.FC = () => {
  const { groups, loading, observerRef, currentUserEmail, navigate, navigateToGroup, joinGroupByCode, deleteGroup, getUnreadCount } = useGroups();
  const { showAlert, showConfirm, showPrompt } = useModal();

  const [uiVisible, setUiVisible] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setUiVisible(currentScroll <= lastScrollY.current || currentScroll <= 80);
      lastScrollY.current = currentScroll;
    };
    const handleClickOutside = () => setActiveMenuId(null);
    
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleJoinByLink = async () => {
    const code = await showPrompt("Entrar via Link", "Cole o código do grupo:", "Ex: AF72B");
    if (code) {
      const result = joinGroupByCode(code);
      if (result) showAlert(result.success ? "Sucesso!" : "Ops!", result.message);
    }
  };

  const handleDeleteRequest = async (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    if (await showConfirm("Excluir Grupo?", "Tem certeza que deseja excluir este grupo permanentemente?", "Excluir", "Cancelar")) {
      deleteGroup(groupId);
    }
  };

  const handleOpenTracking = (group: Group, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setSelectedGroup(group);
    setIsTrackingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-x-hidden">
      <MainHeader 
        leftContent={<button onClick={() => navigate('/top-groups')} className="bg-none border-none text-[#00c2ff] text-lg"><i className="fa-solid fa-ranking-star"></i></button>}
        rightContent={<button onClick={() => navigate('/messages')} className="bg-none border-none text-[#00c2ff] text-lg"><i className="fa-solid fa-message"></i></button>}
        onLogoClick={() => window.scrollTo({top:0, behavior:'smooth'})}
      />

      <main className="flex-grow pt-[100px] pb-[100px] px-4">
        <JoinViaLinkBtn onClick={handleJoinByLink} />

        <div className="w-full">
          {groups.map(group => (
            <GroupListItem 
              key={group.id}
              group={group}
              currentUserEmail={currentUserEmail}
              unreadCount={getUnreadCount(group.id)}
              isMenuActive={activeMenuId === group.id}
              onToggleMenu={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === group.id ? null : group.id); }}
              onItemClick={() => navigateToGroup(group)}
              onTracking={(e) => handleOpenTracking(group, e)}
              onDelete={(e) => handleDeleteRequest(group.id, e)}
            />
          ))}
          {loading && <div className="text-center mt-10"><i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i></div>}
          {!loading && groups.length === 0 && <div className="text-center text-gray-500 mt-10">Você não participa de nenhum grupo.</div>}
          <div ref={observerRef} className="h-10"></div>
        </div>
      </main>

      <CreateGroupFAB visible={uiVisible} onClick={() => navigate('/create-group')} />
      <Footer visible={uiVisible} />

      {isTrackingModalOpen && selectedGroup && (
        <Suspense fallback={null}>
          <TrackingModal 
            isOpen={isTrackingModalOpen}
            onClose={() => setIsTrackingModalOpen(false)}
            group={selectedGroup}
          />
        </Suspense>
      )}
    </div>
  );
};
