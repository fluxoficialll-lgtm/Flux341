import { useState, useEffect } from 'react';
import { Group, Channel, SalesSection, GroupLink, ChannelSection, ScheduledMessage } from '../../../../types';

export const useGroupStructure = (group: Group | null) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelSections, setChannelSections] = useState<ChannelSection[]>([]);
  const [isSalesPlatformEnabled, setIsSalesPlatformEnabled] = useState(false);
  const [salesPlatformSections, setSalesPlatformSections] = useState<SalesSection[]>([]);
  const [salesPlatformAllowDownload, setSalesPlatformAllowDownload] = useState(true);
  const [salesPlatformAllowMemberUpload, setSalesPlatformAllowMemberUpload] = useState(false);
  const [links, setLinks] = useState<GroupLink[]>([]);
  const [schedules, setSchedules] = useState<ScheduledMessage[]>([]);

  useEffect(() => {
    if (group) {
      setChannels(group.channels || []);
      setChannelSections(group.channelSections || []);
      setIsSalesPlatformEnabled(group.isSalesPlatformEnabled || false);
      setSalesPlatformSections(group.salesPlatformSections || []);
      setSalesPlatformAllowDownload(group.salesPlatformAllowDownload ?? true);
      setSalesPlatformAllowMemberUpload(group.salesPlatformAllowMemberUpload ?? false);
      setLinks(group.links || []);
      setSchedules(group.scheduledMessages || []);
    }
  }, [group]);

  return {
    state: { 
      channels, 
      channelSections,
      isSalesPlatformEnabled, 
      salesPlatformSections,
      salesPlatformAllowDownload,
      salesPlatformAllowMemberUpload,
      links,
      schedules
    },
    actions: { 
      setChannels, 
      setChannelSections,
      setIsSalesPlatformEnabled, 
      setSalesPlatformSections,
      setSalesPlatformAllowDownload,
      setSalesPlatformAllowMemberUpload,
      setLinks,
      setSchedules
    },
    getStructurePayload: () => ({
      channels,
      channelSections,
      isSalesPlatformEnabled,
      salesPlatformSections,
      salesPlatformAllowDownload,
      salesPlatformAllowMemberUpload,
      links,
      scheduledMessages: schedules
    })
  };
};