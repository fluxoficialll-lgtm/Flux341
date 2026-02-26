import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupService } from '../../ServiçosFrontend/ServiçoDeGrupos/groupService';
import { Group, GroupLink } from '../../types';

export const useManageGroupLinks = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | undefined>(undefined);
  
  // Form States
  const [newLinkName, setNewLinkName] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  
  const [links, setLinks] = useState<GroupLink[]>([]);

  const loadGroupData = useCallback(() => {
      if (!id) return;
      const foundGroup = groupService.getGroupById(id);
      if (foundGroup) {
          setGroup(foundGroup);
          setLinks(foundGroup.links || []);
      } else {
          // In a real app, you might want to navigate away or show an error
          // For now, we'll just log it.
          console.error("Group not found!");
          navigate('/groups');
      }
  }, [id, navigate]);

  useEffect(() => {
    loadGroupData();
  }, [loadGroupData]);

  const handleCreateLink = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newLinkName.trim() || !id) return;

      const usesLimit = maxUses ? parseInt(maxUses) : undefined;
      const link = groupService.addGroupLink(id, newLinkName, usesLimit, expiresAt);
      
      if (link) {
          setLinks(prev => [link, ...prev]);
          // Reset form
          setNewLinkName('');
          setMaxUses('');
          setExpiresAt('');
      } 
  };

  const handleDeleteLink = (linkId: string) => {
      if (window.confirm("Deseja excluir este link? O código deixará de funcionar.")) {
          if (id) {
            groupService.removeGroupLink(id, linkId);
            setLinks(prev => prev.filter(l => l.id !== linkId));
          }
      }
  };

  const handleCopyLink = (code: string) => {
      const url = `${window.location.origin}/#/groups?join=${code}`;
      navigator.clipboard.writeText(url);
      alert(`Link copiado para a área de transferência!`);
  };

  const formatDate = (dateString?: string) => {
      if (!dateString) return 'Nunca expira';
      return new Date(dateString).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const handleBack = () => {
      if (window.history.state && window.history.state.idx > 0) {
          navigate(-1);
      } else {
          navigate(`/group-chat/${id}`);
      }
  };

  return {
    group,
    links,
    newLinkName,
    setNewLinkName,
    maxUses,
    setMaxUses,
    expiresAt,
    setExpiresAt,
    handleCreateLink,
    handleDeleteLink,
    handleCopyLink,
    handleBack,
    formatDate
  };
};