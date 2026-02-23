
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { groupService } from '../ServiçosFrontend/ServiçoDeGrupos/groupService';
import { syncPayService } from '../ServiçosFrontend/ServiçosDeProvedores/syncPayService.js';

export const useVipSalesHistory = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [sales, setSales] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
      const loadData = async () => {
          setLoading(true);
          const user = authService.getCurrentUser();
          if (!user || !id) {
              setLoading(false);
              return;
          }

          const group = groupService.getGroupById(id);
          if (group) setGroupName(group.name);

          try {
              const transactions = await syncPayService.getTransactions(user.email);
              
              const filtered = transactions.filter(t => {
                  const isPaid = ['paid', 'completed', 'approved', 'settled'].includes((t.status || '').toLowerCase());
                  return t.groupId === id && isPaid;
              });

              filtered.sort((a, b) => {
                  const dateA = new Date(a.created_at || a.createdAt || a.date_created || 0).getTime();
                  const dateB = new Date(b.created_at || b.createdAt || b.date_created || 0).getTime();
                  return dateB - dateA;
              });

              setSales(filtered);

              const total = filtered.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
              setTotalRevenue(total);

          } catch (e) {
              console.error("Erro ao carregar histórico de vendas:", e);
          } finally {
              setLoading(false);
          }
      };

      loadData();
  }, [id]);

  const formatDate = (dateStr?: string) => {
      if (!dateStr) return '-';
      try {
          return new Date(dateStr).toLocaleString('pt-BR', {
              day: '2-digit', month: '2-digit', year: '2-digit',
              hour: '2-digit', minute: '2-digit'
          });
      } catch { return dateStr; }
  };

  const getStatusLabel = (status?: string) => {
      const s = (status || '').toLowerCase();
      if (['paid', 'completed', 'approved', 'settled'].includes(s)) return 'Aprovado';
      if (['pending', 'processing', 'created'].includes(s)) return 'Pendente';
      if (['expired', 'cancelled', 'failed'].includes(s)) return 'Expirado';
      return s || 'Desconhecido';
  };

  const getStatusClass = (status?: string) => {
      const s = (status || '').toLowerCase();
      if (['paid', 'completed', 'approved', 'settled'].includes(s)) return 'approved';
      if (['pending', 'processing', 'created'].includes(s)) return 'pending';
      return 'failed';
  };

  const getPayerName = (sale: any) => {
      if (sale.payer && sale.payer.name) return sale.payer.name;
      if (sale.payer_email) return sale.payer_email.split('@')[0];
      return 'Cliente Desconhecido';
  };

  const handleBack = () => {
      navigate(-1);
  };

  return {
    sales,
    totalRevenue,
    loading,
    groupName,
    formatDate,
    getStatusLabel,
    getStatusClass,
    getPayerName,
    handleBack
  };
};
