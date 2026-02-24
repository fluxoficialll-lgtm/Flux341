
import React, { useState } from 'react';
import { Post } from '../../types';
import { PostHeader } from '../PostHeader';
import { PostText } from '../PostText';
import { ImageCarousel } from '../ImageCarousel';
import { GroupAttachmentCard } from '../groups/GroupAttachmentCard';
import { PollPost } from './PollPost';
import { PostActions } from './PostActions';
import { usePostActions } from '../../hooks/usePostActions';

interface ImageObject {
    url: string;
    alt?: string;
}

interface FeedItemProps {
    post: Post;
    currentUserId?: string;
    onUserClick: (username: string) => void;
    onCommentClick: (id: string) => void;
    onShare: (post: Post) => void;
    onVote: (postId: string, index: number) => void;
    onCtaClick: (link?: string) => void;
}

const CTA_ICONS: Record<string, string> = {
    'conferir': 'fa-eye',
    'participar': 'fa-user-group',
    'comprar': 'fa-cart-shopping',
    'assinar': 'fa-credit-card',
    'entrar': 'fa-arrow-right-to-bracket',
    'descubra': 'fa-compass',
    'baixar': 'fa-download',
    'saiba mais': 'fa-circle-info'
};

export const FeedItem: React.FC<FeedItemProps> = ({ 
    post, 
    currentUserId, 
    onUserClick, 
    onCommentClick, 
    onShare, 
    onVote,
    onCtaClick
}) => {
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const { 
        isLiked, 
        likesCount, 
        handleLike, 
        handleDelete, 
        formatRelativeTime 
    } = usePostActions(post);

    const getCtaIcon = (label: string = '') => {
        const key = label.toLowerCase();
        return CTA_ICONS[key] || 'fa-arrow-right';
    };

    const hasMedia = post.type === 'video' || (post.type === 'photo' && (!!post.image || (post.images && post.images.length > 0)));

    const imageUrls = post.images && Array.isArray(post.images)
        ? post.images.map((img: any) => typeof img === 'object' && img.url ? img.url : img as string)
        : (post.image ? [post.image] : []);

    return (
        <div 
            data-post-id={post.id}
            className="feed-post-item relative bg-[#1a1e26] border border-white/5 rounded-2xl pb-2 mb-6 shadow-lg overflow-hidden animate-fade-in"
        >
            <PostHeader 
                username={post.username} 
                authorEmail={post.authorEmail}
                time={formatRelativeTime(post.timestamp)} 
                location={post.location}
                isAdult={post.isAdultContent}
                isAd={post.isAd}
                onClick={() => onUserClick(post.username)}
                isOwner={currentUserId ? post.authorId === currentUserId : false}
                onDelete={handleDelete}
            />

            <PostText text={post.text as string || ""} onUserClick={onUserClick} />

            {post.type === 'photo' && imageUrls.length > 0 && (
                <div className="w-full overflow-hidden bg-black mb-0">
                    {imageUrls.length > 1 ? (
                        <ImageCarousel images={imageUrls} onImageClick={setZoomedImage} />
                    ) : (
                        <img 
                            src={imageUrls[0]} 
                            loading="lazy"
                            alt="Post content" 
                            className="w-full h-auto max-h-[600px] object-contain cursor-pointer" 
                            onClick={() => setZoomedImage(imageUrls[0]!)}
                        />
                    )}
                </div>
            )}

            {post.type === 'video' && post.video && (
                <div className="w-full overflow-hidden bg-black mb-0">
                    <video 
                        src={post.video} 
                        controls 
                        className="w-full h-auto max-h-[600px] object-contain" 
                    />
                </div>
            )}

            {post.isAd && post.ctaLink ? (
                <div 
                    className={`bg-[#00c2ff]/10 p-4 px-5 flex justify-between items-center border-[#00c2ff]/20 transition-all ${
                        hasMedia 
                        ? 'w-full border-t mb-0' 
                        : 'mx-4 mb-4 rounded-xl border'
                    }`}
                >
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#00c2ff] font-black tracking-[2px] uppercase">Patrocinado</span>
                        <span className="text-[11px] text-gray-400 font-bold">Sugestão Flux</span>
                    </div>
                    <button 
                        className="bg-[#00c2ff] text-black border-none px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2.5 hover:bg-white transition-all shadow-[0_4px_15px_rgba(0,194,255,0.3)] active:scale-95" 
                        onClick={() => onCtaClick(post.ctaLink)}
                    >
                        <i className={`fa-solid ${getCtaIcon(post.ctaText)}`}></i>
                        <span className="uppercase">{post.ctaText || 'Saiba Mais'}</span>
                    </button>
                </div>
            ) : post.relatedGroupId && (
                <div className="mt-2 mb-2">
                    <GroupAttachmentCard groupId={post.relatedGroupId} />
                </div>
            )}

            {post.type === 'poll' && post.pollOptions && (
                <PollPost 
                    postId={post.id}
                    pollOptions={post.pollOptions}
                    votedOptionIndex={post.votedOptionIndex}
                    onVote={onVote} 
                />
            )}

            <PostActions 
                likes={likesCount}
                comments={Array.isArray(post.comments) ? post.comments.length : 0}
                views={post.views}
                liked={isLiked}
                onLike={handleLike}
                onCommentClick={() => onCommentClick(post.id)}
                onShare={() => onShare(post)} 
            />

            {zoomedImage && (
                <div 
                    className="fixed inset-0 z-[60] bg-black bg-opacity-95 flex items-center justify-center p-2"
                    onClick={() => setZoomedImage(null)}
                >
                    <button 
                        className="absolute top-4 right-4 text-white text-4xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
                        onClick={() => setZoomedImage(null)}
                    >
                        &times;
                    </button>
                    <img 
                        src={zoomedImage} 
                        alt="Zoom" 
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()} 
                    />
                </div>
            )}
        </div>
    );
};
