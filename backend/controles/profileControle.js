
import { profileService } from '../ServiçosBackEnd/profileService.js';

const profileControle = {
    getProfileForEdit: async (req, res) => {
        try {
            const profileData = await profileService.getProfileForEdit(req.userId, req.traceId);
            res.json(profileData);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    getPublicProfile: async (req, res) => {
        try {
            const publicProfile = await profileService.getPublicProfile(req.params.username, req.userId, req.traceId);
            res.json(publicProfile);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
};

export default profileControle;
