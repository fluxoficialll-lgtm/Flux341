
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../ServiçosFrontend/ServiçoDePosts/postService';
import { authService } from '../ServiçosFrontend/ServiçoDeAutenticação/authService';
import { Post, PollOption } from '../types';

export const useCreatePoll = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [duration, setDuration] = useState('24 Horas');
  const [isCreateDisabled, setIsCreateDisabled] = useState(true);

  const currentUser = authService.getCurrentUser();
  const username = currentUser?.profile?.name ? `@${currentUser.profile.name}` : "@usuario";
  const avatar = currentUser?.profile?.photoUrl || "https://randomuser.me/api/portraits/men/32.jpg";

  useEffect(() => {
    const questionFilled = question.trim().length > 0;
    const filledOptionsCount = options.filter(opt => opt.trim().length > 0).length;
    setIsCreateDisabled(!(questionFilled && filledOptionsCount >= 2));
  }, [question, options]);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    } else {
      alert('Máximo de 5 opções atingido.');
    }
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleDurationClick = () => {
    const current = duration;
    let newDuration;
    if (current === '24 Horas') newDuration = '7 Dias';
    else if (current === '7 Dias') newDuration = '30 Dias';
    else newDuration = '24 Horas';
    setDuration(newDuration);
    alert(`Duração da enquete alterada para: ${newDuration}.`);
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreateDisabled) return;

    const validOptions = options.filter(opt => opt.trim().length > 0);
    const pollOptionsData: PollOption[] = validOptions.map(opt => ({ text: opt, votes: 0 }));

    const newPost: Post = {
      id: Date.now().toString(),
      type: 'poll',
      authorId: currentUser?.id || '',
      username: username,
      avatar: avatar,
      text: question,
      time: "Agora",
      timestamp: Date.now(),
      isPublic: true,
      views: 0,
      likes: 0,
      comments: 0,
      liked: false,
      pollOptions: pollOptionsData,
      votedOptionIndex: null
    };

    postService.addPost(newPost);
    navigate('/feed');
  };

  const handleNavigateBack = () => navigate('/create-post');

  return {
    question,
    setQuestion,
    options,
    duration,
    isCreateDisabled,
    handleAddOption,
    handleRemoveOption,
    handleOptionChange,
    handleDurationClick,
    handleCreatePoll,
    handleNavigateBack
  };
};
