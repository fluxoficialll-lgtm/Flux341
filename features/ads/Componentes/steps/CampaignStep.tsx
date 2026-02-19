
import React from 'react';
import { AdCampaign } from '../../../../types';
import { CampaignMacroCard } from '../../../../Componentes/ads/CampaignMacroCard';
import { ObjectiveSection } from '../../../../Componentes/ads/ObjectiveSection';

interface CampaignStepProps {
    campaign: Partial<AdCampaign>;
    onInputChange: (field: keyof AdCampaign, value: any) => void;
}

export const CampaignStep: React.FC<CampaignStepProps> = ({ campaign, onInputChange }) => {
    return (
        <div className="animate-fade-in space-y-5">
            <CampaignMacroCard 
                name={campaign.name || ''} 
                onNameChange={(val) => onInputChange('name', val)} 
            />
            <ObjectiveSection 
                campaign={campaign} 
                onInputChange={onInputChange} 
            />
        </div>
    );
};
