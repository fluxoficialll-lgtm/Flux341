
import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const styles: { [key: string]: React.CSSProperties } = {
  gridContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '8px',
    backgroundColor: 'rgba(0,0,0,0.1)',
    margin: '8px auto',
    width: 'calc(100% - 16px)',
    boxSizing: 'border-box',
  },
  gridItem: {
    flex: '1 0 21%', // Ocupa no máximo 21% para caber até 4 por linha com margens
    margin: '4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 8px',
    backgroundColor: 'rgba(42, 47, 53, 0.8)',
    backdropFilter: 'blur(5px)',
    borderRadius: '12px',
    color: '#e1e2e3',
    textAlign: 'center',
    cursor: 'pointer',
    aspectRatio: '1 / 1',
    fontSize: '0.7rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  icon: {
    marginBottom: '8px',
    fontSize: '1.4rem',
  },
};

export interface Acao {
  id: string;
  label: string;
  icon: IconProp;
  onClick: () => void;
}

interface ModalGradeDeAcoesProps {
  acoes: Acao[];
  visible: boolean;
}

export const ModalGradeDeAcoes: React.FC<ModalGradeDeAcoesProps> = ({ acoes, visible }) => {
  if (!visible || !acoes || acoes.length === 0) {
    return null;
  }

  return (
    <div style={styles.gridContainer}>
      {acoes.map((acao) => (
        <div key={acao.id} style={styles.gridItem} onClick={acao.onClick}>
          <FontAwesomeIcon icon={acao.icon} style={styles.icon} />
          <span>{acao.label}</span>
        </div>
      ))}
    </div>
  );
};
