
import React, { useState, useEffect, useRef, useMemo } from 'react';
import DOMPurify from 'dompurify';

interface PostTextProps {
    text: string;
    onUserClick: (handle: string) => void;
    className?: string;
}

// Componente para renderizar menções como links clicáveis.
const Mention = ({ children, onUserClick }: { children: string, onUserClick: (handle: string) => void }) => (
    <span 
        className="text-[#00c2ff] font-semibold cursor-pointer hover:underline"
        onClick={(e) => { e.stopPropagation(); onUserClick(children as string); }}
    >
        {children}
    </span>
);

export const PostText: React.FC<PostTextProps> = ({ text, onUserClick, className = "px-4 mb-3" }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLongText, setIsLongText] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const MAX_COLLAPSED_HEIGHT = 120; // Aproximadamente 5 linhas

    useEffect(() => {
        // Verifica se o texto excede a altura máxima quando renderizado
        if (containerRef.current && containerRef.current.scrollHeight > MAX_COLLAPSED_HEIGHT) {
            setIsLongText(true);
        }
    }, [text]);

    // [CORREÇÃO FINAL] Lógica de renderização de texto completamente refeita.
    // 1. Sanitiza o HTML para prevenir ataques XSS.
    // 2. Usa um parser robusto para encontrar e substituir @menções.
    // 3. Controla a expansão do texto com base na altura, o que é mais confiável.
    const parsedText = useMemo(() => {
        if (!text) return null;

        // Limpa o texto de qualquer HTML/script malicioso.
        const sanitizedText = DOMPurify.sanitize(text);

        // Divide o texto em partes: texto normal e menções.
        const parts = sanitizedText.split(/(@[a-zA-Z0-9_]+)/g);

        return parts.map((part, index) => {
            if (part.match(/(@[a-zA-Z0-9_]+)/)) {
                return <Mention key={index} onUserClick={onUserClick}>{part}</Mention>;
            }
            // Retorna a parte do texto dentro de um fragmento para garantir que seja um elemento React válido.
            // Isso evita o erro "Cannot convert object to primitive value" que pode ocorrer com strings vazias.
            return <React.Fragment key={index}>{part}</React.Fragment>;
        });
    }, [text, onUserClick]);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={className}>
            <div 
                ref={containerRef}
                className="text-[15px] leading-[1.6] whitespace-pre-wrap break-words text-gray-200 font-normal transition-all duration-300"
                style={{ maxHeight: isLongText && !isExpanded ? `${MAX_COLLAPSED_HEIGHT}px` : 'none', overflow: 'hidden' }}
            >
                {parsedText}
            </div>
            
            {isLongText && (
                <button 
                    onClick={handleToggle}
                    className="text-[#00c2ff] font-bold cursor-pointer text-sm hover:underline bg-transparent border-none p-0 mt-1"
                >
                    {isExpanded ? 'Ler menos' : 'Ler mais'}
                </button>
            )}
        </div>
    );
};
