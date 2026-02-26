import React from 'react';
import { Stat } from './Stat';
import { UserName } from '../ComponenteDeInterfaceDeUsuario/user/UserName';
import { UserAvatar } from '../ComponenteDeInterfaceDeUsuario/user/UserAvatar';

export const ProfileInfoCard = () => {
    return (
        <div className="profile-info-card">

            <div className="avatar-container">
                <UserAvatar src="https://via.placeholder.com/150" size={80} />
            </div>

            <div className="user-details">
                <UserName username="usuario" isVerified={true} />
                <p className="bio">Sem biografia definida.</p>
            </div>

            <div className="stats-container">
                <Stat value={10} label="Posts" />
                <Stat value={100} label="Seguidores" />
                <Stat value={50} label="Seguindo" />
            </div>

            <div className="profile-actions">
                <button className="btn-edit">Editar Perfil</button>
            </div>

        </div>
    );
};